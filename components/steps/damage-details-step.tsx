"use client"

import React, { useState, useRef } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { AccidentFormData } from "@/lib/types"
import { Upload, Loader, X } from "lucide-react"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Define vehicle areas with their labels and SVG properties
const vehicleAreas = [
  { id: "front-bumper", label: "Bară Față" },
  { id: "hood", label: "Capotă" },
  { id: "windshield", label: "Parbriz" },
  { id: "roof", label: "Plafon" },
  { id: "rear-window", label: "Lunetă" },
  { id: "trunk", label: "Portbagaj" },
  { id: "rear-bumper", label: "Bară Spate" },
  { id: "front-right-fender", label: "Aripă Dreapta Față" },
  { id: "front-right-door", label: "Ușă Dreapta Față" },
  { id: "rear-right-door", label: "Ușă Dreapta Spate" },
  { id: "rear-right-fender", label: "Aripă Dreapta Spate" },
  { id: "front-left-fender", label: "Aripă Stânga Față" },
  { id: "front-left-door", label: "Ușă Stânga Față" },
  { id: "rear-left-door", label: "Ușă Stânga Spate" },
  { id: "rear-left-fender", label: "Aripă Stânga Spate" },
]

const getAreaLabel = (areaId: string | null) => {
  if (!areaId) return null
  const area = vehicleAreas.find((a) => a.id === areaId)
  return area ? area.label : null
}

// Helper to safely split the potentially null/string value into an array
const getPointsArray = (value: string | null | undefined): string[] => {
  if (typeof value === 'string' && value.length > 0) {
    return value.split(',');
  } 
  return [];
};

export default function ImpactPointStep() {
  const { control, setValue, getValues, register } = useFormContext<AccidentFormData>()
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSimulatedImage, setShowSimulatedImage] = useState(false);
  const [simulatedDescription, setSimulatedDescription] = useState<string | null>(null);
  const [accidentPhotos, setAccidentPhotos] = useState<string[]>(getValues("damages.vehicleA.photos") || []);

  // Ref for single hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Watch the raw value (string | null)
  const impactPointsRaw = useWatch({
    control,
    name: "impactPoints",
    defaultValue: { vehicleA: null, vehicleB: null } // Keep original default type
  })

  // Derive arrays for internal use
  const currentPoints = {
    vehicleA: getPointsArray(impactPointsRaw?.vehicleA),
    vehicleB: getPointsArray(impactPointsRaw?.vehicleB)
  };

  const handleVehicleAClick = (area: string) => {
    const currentSelectionA = currentPoints.vehicleA; // Already an array here
    let newSelectionA: string[];

    if (currentSelectionA.includes(area)) {
      newSelectionA = currentSelectionA.filter(p => p !== area);
    } else {
      newSelectionA = [...currentSelectionA, area];
    }
    
    // Join the array back into a string for storage
    const stringValueA = newSelectionA.join(',');
    
    const newValueForForm = { 
      ...(impactPointsRaw ?? { vehicleA: null, vehicleB: null }), // Start with raw values
      vehicleA: stringValueA || null // Store string or null
    };
    setValue("impactPoints", newValueForForm, { shouldDirty: true, shouldTouch: true });
  }

  const handleVehicleBClick = (area: string) => {
    const currentSelectionB = currentPoints.vehicleB; // Already an array here
    let newSelectionB: string[];

    if (currentSelectionB.includes(area)) {
      newSelectionB = currentSelectionB.filter(p => p !== area);
    } else {
      newSelectionB = [...currentSelectionB, area];
    }

    // Join the array back into a string for storage
    const stringValueB = newSelectionB.join(',');

    const newValueForForm = { 
      ...(impactPointsRaw ?? { vehicleA: null, vehicleB: null }), // Start with raw values
      vehicleB: stringValueB || null // Store string or null
    };
    setValue("impactPoints", newValueForForm, { shouldDirty: true, shouldTouch: true });
  }

  // --- Simulation Function ---
  const handleSimulateUploadAndAnalysis = async () => {
    setShowSimulatedImage(false);
    setSimulatedDescription(null);
    setIsAnalyzing(true);
    console.log("Simulating upload of accident.png and AI analysis...");

    // Simulate network delay and processing time
    await new Promise(resolve => setTimeout(resolve, 2500)); 

    // Simulate points as arrays, then join for storage
    const simulatedPointsArrays = {
      vehicleA: ["front-bumper"],
      vehicleB: ["rear-right-fender"]
    };
    const simulatedPointsStrings = {
      vehicleA: simulatedPointsArrays.vehicleA.join(','),
      vehicleB: simulatedPointsArrays.vehicleB.join(',')
    };

    setValue("impactPoints", simulatedPointsStrings, { shouldDirty: true, shouldTouch: true });
    console.log("Simulated analysis complete. Impact points set (as strings):", simulatedPointsStrings);
    
    setSimulatedDescription("Analiza AI indică un impact frontal (Bară Față) pentru Vehiculul A și un impact în zona aripii dreapta spate pentru Vehiculul B.");
    setShowSimulatedImage(true);
    setIsAnalyzing(false);
  };
  // --- End Simulation Function ---

  // --- Photo Handlers (Consolidated) ---
  const MAX_PHOTOS = 5;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const currentTotalPhotos = accidentPhotos.length;
    const allowedNewPhotos = MAX_PHOTOS - currentTotalPhotos;

    if (allowedNewPhotos <= 0) {
      alert(`Puteți încărca maxim ${MAX_PHOTOS} fotografii în total.`);
      return;
    }

    const newPhotoPreviews: string[] = [];
    // TEMPORARILY using vehicleA.photos for storage
    const currentFormDataPhotos = getValues("damages.vehicleA.photos") || [];
    const newPhotoFormData: string[] = [...currentFormDataPhotos];

    const filesToProcess = Array.from(files).slice(0, allowedNewPhotos);

    filesToProcess.forEach(file => {
      if (file.type.startsWith("image/")) {
        const previewUrl = URL.createObjectURL(file);
        newPhotoPreviews.push(previewUrl);
        
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result && typeof e.target.result === 'string') {
            newPhotoFormData.push(e.target.result);
            // TEMPORARILY using vehicleA.photos for storage
             setValue("damages.vehicleA.photos", newPhotoFormData, { shouldDirty: true });
          }
        };
        reader.readAsDataURL(file);
      }
    });

    // Update preview state
    setAccidentPhotos(prev => [...prev, ...newPhotoPreviews]);

    // Clear the file input value
    event.target.value = ""; 
  };

  const handleRemovePhoto = (index: number) => {
    // TEMPORARILY using vehicleA.photos for storage
    const currentFormDataPhotos = getValues("damages.vehicleA.photos") || [];

    // Revoke object URL for the preview being removed
    URL.revokeObjectURL(accidentPhotos[index]);

    const updatedPreviews = accidentPhotos.filter((_, i) => i !== index);
    const updatedFormData = currentFormDataPhotos.filter((_, i) => i !== index);

    setAccidentPhotos(updatedPreviews);
    // TEMPORARILY using vehicleA.photos for storage
    setValue("damages.vehicleA.photos", updatedFormData, { shouldDirty: true });
  };
  // --- End Photo Handlers ---

  // Reusable SVG Car Component - updated to accept selectedPoints array
  const SvgCar = ({ selectedPoints, handleClick }: { selectedPoints: string[], handleClick: (area: string) => void }) => (
    <svg viewBox="0 0 200 340" className="absolute inset-0 w-full h-full p-2 sm:p-4"> {/* Adjusted viewBox */}
      {/* Apply common styles to group */}
      <g stroke="#4a5568" strokeWidth="0.8" fill="#f7fafc">

        {/* --- Central Body --- */}
        {/* Front Bumper - Curved Path */}
        <path
          d="M 60 20 Q 100 5 140 20 L 145 40 L 55 40 Z"
          // Check if area is included in the array
          fill={selectedPoints.includes("front-bumper") ? "#fed7d7" : "#e2e8f0"}
          stroke={selectedPoints.includes("front-bumper") ? "#e53e3e" : "#4a5568"}
          strokeWidth={selectedPoints.includes("front-bumper") ? "1.5" : "0.8"}
          onClick={() => handleClick("front-bumper")} style={{ cursor: "pointer" }}
          className="car-part hover:opacity-80 transition-opacity"
        />
        {/* Hood */}
        <rect x="55" y="40" width="90" height="50" rx="3"
          fill={selectedPoints.includes("hood") ? "#fed7d7" : "#f7fafc"}
          stroke={selectedPoints.includes("hood") ? "#e53e3e" : "#4a5568"}
          strokeWidth={selectedPoints.includes("hood") ? "1.5" : "0.8"}
          onClick={() => handleClick("hood")} style={{ cursor: "pointer" }}
          className="car-part hover:opacity-80 transition-opacity"
        />
        {/* Windshield */}
        <rect x="60" y="90" width="80" height="35" rx="5"
          fill={selectedPoints.includes("windshield") ? "#fed7d7" : "#ebf8ff"} // Light blue for glass
          stroke={selectedPoints.includes("windshield") ? "#e53e3e" : "#4a5568"}
          strokeWidth={selectedPoints.includes("windshield") ? "1.5" : "0.8"}
          onClick={() => handleClick("windshield")} style={{ cursor: "pointer" }}
          className="car-part hover:opacity-80 transition-opacity"
        />
        {/* Roof */}
        <rect x="55" y="125" width="90" height="90" rx="5"
          fill={selectedPoints.includes("roof") ? "#fed7d7" : "#f7fafc"}
          stroke={selectedPoints.includes("roof") ? "#e53e3e" : "#4a5568"}
          strokeWidth={selectedPoints.includes("roof") ? "1.5" : "0.8"}
          onClick={() => handleClick("roof")} style={{ cursor: "pointer" }}
          className="car-part hover:opacity-80 transition-opacity"
        />
        {/* Rear Window */}
        <rect x="60" y="215" width="80" height="35" rx="5"
          fill={selectedPoints.includes("rear-window") ? "#fed7d7" : "#ebf8ff"} // Light blue for glass
          stroke={selectedPoints.includes("rear-window") ? "#e53e3e" : "#4a5568"}
          strokeWidth={selectedPoints.includes("rear-window") ? "1.5" : "0.8"}
          onClick={() => handleClick("rear-window")} style={{ cursor: "pointer" }}
          className="car-part hover:opacity-80 transition-opacity"
        />
        {/* Trunk */}
        <rect x="55" y="250" width="90" height="50" rx="3"
          fill={selectedPoints.includes("trunk") ? "#fed7d7" : "#f7fafc"}
          stroke={selectedPoints.includes("trunk") ? "#e53e3e" : "#4a5568"}
          strokeWidth={selectedPoints.includes("trunk") ? "1.5" : "0.8"}
          onClick={() => handleClick("trunk")} style={{ cursor: "pointer" }}
          className="car-part hover:opacity-80 transition-opacity"
        />
        {/* Rear Bumper - Curved Path */}
        <path
          d="M 55 300 L 145 300 Q 100 325 55 300 Z"
           fill={selectedPoints.includes("rear-bumper") ? "#fed7d7" : "#e2e8f0"}
           stroke={selectedPoints.includes("rear-bumper") ? "#e53e3e" : "#4a5568"}
           strokeWidth={selectedPoints.includes("rear-bumper") ? "1.5" : "0.8"}
           onClick={() => handleClick("rear-bumper")} style={{ cursor: "pointer" }}
           className="car-part hover:opacity-80 transition-opacity"
        />

        {/* --- Left Side --- */}
        {/* Front Left Fender */}
        <rect x="30" y="40" width="25" height="50" rx="5"
          fill={selectedPoints.includes("front-left-fender") ? "#fed7d7" : "#f7fafc"}
          stroke={selectedPoints.includes("front-left-fender") ? "#e53e3e" : "#4a5568"}
          strokeWidth={selectedPoints.includes("front-left-fender") ? "1.5" : "0.8"}
          onClick={() => handleClick("front-left-fender")} style={{ cursor: "pointer" }}
          className="car-part hover:opacity-80 transition-opacity"
        />
        {/* Front Left Door */}
        <rect x="30" y="125" width="25" height="45" rx="3"
          fill={selectedPoints.includes("front-left-door") ? "#fed7d7" : "#f7fafc"}
          stroke={selectedPoints.includes("front-left-door") ? "#e53e3e" : "#4a5568"}
          strokeWidth={selectedPoints.includes("front-left-door") ? "1.5" : "0.8"}
          onClick={() => handleClick("front-left-door")} style={{ cursor: "pointer" }}
          className="car-part hover:opacity-80 transition-opacity"
        />
        {/* Rear Left Door */}
        <rect x="30" y="170" width="25" height="45" rx="3"
          fill={selectedPoints.includes("rear-left-door") ? "#fed7d7" : "#f7fafc"}
          stroke={selectedPoints.includes("rear-left-door") ? "#e53e3e" : "#4a5568"}
          strokeWidth={selectedPoints.includes("rear-left-door") ? "1.5" : "0.8"}
          onClick={() => handleClick("rear-left-door")} style={{ cursor: "pointer" }}
          className="car-part hover:opacity-80 transition-opacity"
        />
        {/* Rear Left Fender */}
        <rect x="30" y="250" width="25" height="50" rx="5"
          fill={selectedPoints.includes("rear-left-fender") ? "#fed7d7" : "#f7fafc"}
          stroke={selectedPoints.includes("rear-left-fender") ? "#e53e3e" : "#4a5568"}
          strokeWidth={selectedPoints.includes("rear-left-fender") ? "1.5" : "0.8"}
          onClick={() => handleClick("rear-left-fender")} style={{ cursor: "pointer" }}
          className="car-part hover:opacity-80 transition-opacity"
        />

        {/* --- Right Side --- */}
        {/* Front Right Fender */}
        <rect x="145" y="40" width="25" height="50" rx="5"
          fill={selectedPoints.includes("front-right-fender") ? "#fed7d7" : "#f7fafc"}
          stroke={selectedPoints.includes("front-right-fender") ? "#e53e3e" : "#4a5568"}
          strokeWidth={selectedPoints.includes("front-right-fender") ? "1.5" : "0.8"}
          onClick={() => handleClick("front-right-fender")} style={{ cursor: "pointer" }}
          className="car-part hover:opacity-80 transition-opacity"
        />
        {/* Front Right Door */}
        <rect x="145" y="125" width="25" height="45" rx="3"
          fill={selectedPoints.includes("front-right-door") ? "#fed7d7" : "#f7fafc"}
          stroke={selectedPoints.includes("front-right-door") ? "#e53e3e" : "#4a5568"}
          strokeWidth={selectedPoints.includes("front-right-door") ? "1.5" : "0.8"}
          onClick={() => handleClick("front-right-door")} style={{ cursor: "pointer" }}
          className="car-part hover:opacity-80 transition-opacity"
        />
        {/* Rear Right Door */}
        <rect x="145" y="170" width="25" height="45" rx="3"
          fill={selectedPoints.includes("rear-right-door") ? "#fed7d7" : "#f7fafc"}
          stroke={selectedPoints.includes("rear-right-door") ? "#e53e3e" : "#4a5568"}
          strokeWidth={selectedPoints.includes("rear-right-door") ? "1.5" : "0.8"}
          onClick={() => handleClick("rear-right-door")} style={{ cursor: "pointer" }}
          className="car-part hover:opacity-80 transition-opacity"
        />
        {/* Rear Right Fender */}
        <rect x="145" y="250" width="25" height="50" rx="5"
          fill={selectedPoints.includes("rear-right-fender") ? "#fed7d7" : "#f7fafc"}
          stroke={selectedPoints.includes("rear-right-fender") ? "#e53e3e" : "#4a5568"}
          strokeWidth={selectedPoints.includes("rear-right-fender") ? "1.5" : "0.8"}
          onClick={() => handleClick("rear-right-fender")} style={{ cursor: "pointer" }}
          className="car-part hover:opacity-80 transition-opacity"
        />

        {/* --- Non-Clickable Details --- */}
        {/* Wheels */}
        <circle cx="35" cy="105" r="15" fill="#a0aec0" stroke="#4a5568" strokeWidth="0.5" />
        <circle cx="35" cy="235" r="15" fill="#a0aec0" stroke="#4a5568" strokeWidth="0.5" />
        <circle cx="165" cy="105" r="15" fill="#a0aec0" stroke="#4a5568" strokeWidth="0.5" />
        <circle cx="165" cy="235" r="15" fill="#a0aec0" stroke="#4a5568" strokeWidth="0.5" />

        {/* Mirrors */}
        <rect x="15" y="115" width="15" height="10" rx="3" fill="#a0aec0" stroke="#4a5568" strokeWidth="0.5" />
        <rect x="170" y="115" width="15" height="10" rx="3" fill="#a0aec0" stroke="#4a5568" strokeWidth="0.5" />

        {/* Pillars (simple lines) */}
        <line x1="55" y1="90" x2="60" y2="125" strokeWidth="2" stroke="#a0aec0" /> {/* A-Pillar L */}
        <line x1="145" y1="90" x2="140" y2="125" strokeWidth="2" stroke="#a0aec0" /> {/* A-Pillar R */}
        <line x1="55" y1="170" x2="55" y2="125" strokeWidth="3" stroke="#a0aec0" /> {/* B-Pillar L */}
        <line x1="145" y1="170" x2="145" y2="125" strokeWidth="3" stroke="#a0aec0" /> {/* B-Pillar R */}
        <line x1="55" y1="215" x2="60" y2="250" strokeWidth="2" stroke="#a0aec0" /> {/* C-Pillar L */}
        <line x1="145" y1="215" x2="140" y2="250" strokeWidth="2" stroke="#a0aec0" /> {/* C-Pillar R */}

      </g>
    </svg>
  );

  return (
    <div className="space-y-6 p-4 rounded-lg" style={{ backgroundColor: '#E8F0FB' }}>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Puncte de Impact</h3>
        <p className="text-gray-600">
          Selectați zonele principale de impact pentru fiecare vehicul. Puteți selecta doar o zonă per vehicul.
        </p>
      </div>

      {/* Consolidated Photo Upload Section */}
      <div className="space-y-3 p-4 rounded-lg border border-gray-200" style={{ backgroundColor: '#D6E5F8' }}>
        <h4 className="font-semibold text-gray-800">Fotografii Accident (Max {MAX_PHOTOS} Total)</h4>
         <div className="space-y-2">
           {/* <Label>Fotografii</Label> Optional label */}
           <Button
             type="button"
             variant="outline"
             className="w-full bg-white border-gray-300 text-gray-700"
             onClick={() => fileInputRef.current?.click()}
             disabled={accidentPhotos.length >= MAX_PHOTOS} // Disable if max reached
           >
             <Upload className="mr-2 h-4 w-4" /> Încarcă Fotografii
           </Button>
           <input
             type="file"
             ref={fileInputRef}
             multiple
             accept="image/*"
             onChange={handleFileChange} // Use consolidated handler
             className="hidden"
           />
           {accidentPhotos.length > 0 && (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mt-2">
               {accidentPhotos.map((photoUrl, index) => (
                 <div key={index} className="relative aspect-square border rounded overflow-hidden shadow-sm">
                   <Image src={photoUrl} alt={`Accident Photo ${index + 1}`} layout="fill" objectFit="cover" />
                   <Button
                     type="button"
                     variant="destructive"
                     size="icon"
                     className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-80 hover:opacity-100"
                     onClick={() => handleRemovePhoto(index)} // Use consolidated handler
                   >
                     <X className="h-4 w-4" />
                   </Button>
                 </div>
               ))}
             </div>
           )}
         </div>
       </div>

      {/* --- Simulation Button --- */}
      <div className="my-4 text-center">
        <Button 
          onClick={handleSimulateUploadAndAnalysis} 
          disabled={isAnalyzing}
          className="inline-flex items-center gap-2"
        >
          {isAnalyzing ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {isAnalyzing ? "Analizând Imaginea..." : "Analiză AI"}
        </Button>
      </div>
      {/* --- End Simulation Button --- */}

      {/* --- Simulated Image & Description Display --- */}
      {showSimulatedImage && (
        <div className="my-4 p-3 border border-dashed border-gray-300 rounded-md max-w-3xl mx-auto bg-white shadow-sm flex flex-col items-center gap-4">
           {/* Image Container */}
           <div className="w-full">
             <p className="text-xs text-center text-gray-500 mb-1">Imagine Simulată Analizată:</p>
             <Image
               src="/accident.png"
               alt="Simulated Accident Photo"
               width={250}
               height={180}
               className="rounded object-contain shadow-sm mx-auto"
             />
           </div>
           {/* Description Container */}
           {simulatedDescription && (
            <div className="w-full p-2 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm italic text-blue-800 text-center">
                <span className="font-semibold block mb-1">Rezumat AI:</span> {simulatedDescription}
              </p>
            </div>
          )}
        </div>
      )}
      {/* --- End Simulated Image & Description Display --- */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
        {/* Vehicle A */}
        <div className="space-y-2">
          <h4 className="text-center font-semibold text-gray-800">Vehicul A (Dvs.)</h4>
          <Card className="border-gray-300 shadow-sm relative aspect-[2/3]">
            <CardContent className="p-0 w-full h-full">
              {/* Pass the derived array to SvgCar */}
              <SvgCar selectedPoints={currentPoints.vehicleA} handleClick={handleVehicleAClick} />
            </CardContent>
          </Card>
          {/* Use the derived array for label display */}
          <p className="text-sm text-center min-h-[40px] px-2">
            {currentPoints.vehicleA.length > 0
              ? `Puncte: ${currentPoints.vehicleA.map(getAreaLabel).filter(Boolean).join(", ")}`
              : "Niciun punct selectat"}
          </p>
        </div>

        {/* Vehicle B */}
        <div className="space-y-2">
          <h4 className="text-center font-semibold text-gray-800">Vehicul B</h4>
          <Card className="border-gray-300 shadow-sm relative aspect-[2/3]">
            <CardContent className="p-0 w-full h-full">
               {/* Pass the derived array to SvgCar */}
              <SvgCar selectedPoints={currentPoints.vehicleB} handleClick={handleVehicleBClick} />
            </CardContent>
          </Card>
           {/* Use the derived array for label display */}
          <p className="text-sm text-center min-h-[40px] px-2">
            {currentPoints.vehicleB.length > 0
              ? `Puncte: ${currentPoints.vehicleB.map(getAreaLabel).filter(Boolean).join(", ")}`
              : "Niciun punct selectat"}
          </p>
        </div>
      </div>
    </div>
  )
}