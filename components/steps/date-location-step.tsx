"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, MapPin } from "lucide-react"
import { useFormContext } from "react-hook-form"
import type { AccidentFormData } from "@/lib/types"
import { useState, useEffect } from "react"

export default function DateLocationStep() {
  const { register, setValue, getValues } = useFormContext<AccidentFormData>()
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    setValue("dateTime.date", `${year}-${month}-${day}`);
    setValue("dateTime.time", `${hours}:${minutes}`);

    // Prefill location fields
    setValue("location.city", "Chișinău");
    setValue("location.street", "Strada Studenților");
    setValue("location.number", "10");

  }, [setValue]);

  const handleUseCurrentLocation = () => {
    setIsLoadingLocation(true)
    setLocationError(null);
    setLatitude(null); // Clear previous coords
    setLongitude(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocația nu este suportată de acest browser.");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lon } = position.coords;
        setLatitude(lat);
        setLongitude(lon);
        setLocationError(null);
        // Keep loading indicator active while geocoding

        // --- Reverse Geocoding using Nominatim --- 
        const reverseGeocode = async () => {
          try {
            // Construct Nominatim URL
            const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;

            console.log("Fetching address from Nominatim:", url);

            const response = await fetch(url, {
              // Headers might be needed for stricter usage policy compliance in production
              // headers: { 
              //   'User-Agent': 'YourAppName/1.0 (yourwebsite.com or contact@email.com)'
              // }
            });

            if (!response.ok) {
              throw new Error(`Nominatim request failed with status ${response.status}`);
            }

            const data = await response.json();
            console.log("Nominatim response:", data);

            if (data && data.address) {
              const address = data.address;
              // Extract address components (handle potential missing fields)
              const city = address.city || address.town || address.village || "";
              const street = address.road || "";
              const number = address.house_number || "";

              console.log("Parsed address:", { city, street, number });
              setValue("location.city", city);
              setValue("location.street", street);
              setValue("location.number", number);
              setLocationError(null); // Clear error on success
            } else {
              throw new Error("Nominatim response did not contain address details.");
            }

          } catch (error) {
            console.error("Reverse geocoding error:", error);
            setLocationError("Nu s-a putut obține adresa exactă. Completați manual.");
            // Clear fields on error as we couldn't determine them
            setValue("location.city", ""); 
            setValue("location.street", "");
            setValue("location.number", "");
          } finally {
            setIsLoadingLocation(false); // Stop loading indicator
          }
        };

        reverseGeocode(); // Call the async function
        // --- End Reverse Geocoding ---

      },
      (error) => {
        console.error("Error getting location:", error);
        let message = "Nu s-a putut obține locația. ";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            message += "Permisiune refuzată.";
            break;
          case error.POSITION_UNAVAILABLE:
            message += "Informații despre locație indisponibile.";
            break;
          case error.TIMEOUT:
            message += "Cererea de locație a expirat.";
            break;
          default:
            message += "Eroare necunoscută.";
            break;
        }
        setLocationError(message);
        // Keep existing/default values in input fields
        setIsLoadingLocation(false);
      }
    );
  }

  // Generate map source URL
  const mapSrc = latitude && longitude ? 
    `https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.00025},${latitude-0.000125},${longitude+0.00025},${latitude+0.000125}&layer=mapnik&marker=${latitude},${longitude}` // Max zoom bbox, standard mapnik layer
    : null;

  return (
    <div className="space-y-4 p-4 rounded-lg" style={{ backgroundColor: '#E8F0FB' }}>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Data și Ora Accidentului</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="date">Data</Label>
            <Input id="date" type="date" {...register("dateTime.date")} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="time">Ora</Label>
            <Input id="time" type="time" {...register("dateTime.time")} />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-lg font-semibold">Locația Accidentului</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUseCurrentLocation}
            disabled={isLoadingLocation}
            className="flex items-center gap-1 text-sm text-gray-700 ml-auto flex-shrink-0"
          >
            {isLoadingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
            <span className="hidden sm:inline">Locația Curentă</span>
            <span className="sm:hidden">Locația Curentă</span>
          </Button>
        </div>
        
        {locationError && (
            <p className="text-red-600 text-sm">{locationError}</p>
        )}

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="city">Localitate</Label>
            <Input id="city" placeholder="Ex: Chișinău" {...register("location.city")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="street">Stradă</Label>
            <Input id="street" placeholder="Ex: Bulevardul Ștefan cel Mare" {...register("location.street")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="number">Nr. / Bornă Kilometrică (opțional)</Label>
            <Input id="number" placeholder="Ex: 42 sau km 12+500" {...register("location.number")} />
          </div>
        </div>

        {/* Map Display Area */}
        {latitude && longitude && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-600">
              Locația dvs. a fost detectată și marcată pe hartă. Vă rugăm să completați/ajustați manual câmpurile Stradă și Număr de mai sus, folosind harta ca ghid.
            </p>
            {mapSrc && (
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <iframe
                  width="100%"
                  height="300"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={mapSrc}
                  title="OpenStreetMap Location"
                  style={{ border: 0 }}
                  loading="lazy"
                ></iframe>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
