"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Smartphone } from "lucide-react"
import { useFormContext } from "react-hook-form"
import type { AccidentFormData } from "@/lib/types"
import { useState, useEffect } from "react"

const MOCK_VEHICLES = [
  { id: "1", name: "Toyota Corolla (XYZ 789)" },
  { id: "2", name: "Volkswagen Golf (ABC 123)" },
]

const MOCK_INSURANCE = [
  { id: "1", name: "ASITO - Poliță RCA 12345678" },
  { id: "2", name: "MOLDASIG - Poliță RCA 87654321" },
]

export default function PartyADataStep() {
  const { register, setValue, watch } = useFormContext<AccidentFormData>()
  const [isLoadingEvo, setIsLoadingEvo] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<string>("1") // Pre-select first vehicle
  const [selectedInsurance, setSelectedInsurance] = useState<string>("1") // Pre-select first insurance
  const [isNewVehicle, setIsNewVehicle] = useState(false)
  const [isNewInsurance, setIsNewInsurance] = useState(false)

  const hasTrailer = watch("vehicleA.hasTrailer")

  // Pre-fill data based on initial vehicle selection
  useEffect(() => {
    handleVehicleSelect("1") // Auto-select first vehicle
    handleInsuranceSelect("1") // Auto-select first insurance
  }, [])

  const handleEvoImport = () => {
    setIsLoadingEvo(true)
    // Simulate loading data from EVO/MConnect
    setTimeout(() => {
      setValue("driverA.firstName", "Ion")
      setValue("driverA.lastName", "Popescu")
      setValue("driverA.idnp", "2002004123456")
      setValue("driverA.address", "Str. Independenței 12, Chișinău")
      setValue("driverA.phone", "069123456")
      setValue("driverA.license.number", "MD123456")
      setValue("driverA.license.categories", "B")
      setValue("driverA.license.issueDate", "2015-06-15")
      setValue("driverA.license.expiryDate", "2025-06-15")
      setIsLoadingEvo(false)
    }, 1500)
  }

  const handleVehicleSelect = (value: string) => {
    setSelectedVehicle(value)
    if (value === "new") {
      setIsNewVehicle(true)
      // Clear vehicle fields
      setValue("vehicleA.make", "")
      setValue("vehicleA.model", "")
      setValue("vehicleA.plateNumber", "")
      setValue("vehicleA.vin", "")
    } else {
      setIsNewVehicle(false)
      // Simulate loading selected vehicle data
      const vehicle = MOCK_VEHICLES.find((v) => v.id === value)
      if (vehicle && vehicle.id === "1") {
        setValue("vehicleA.make", "Toyota")
        setValue("vehicleA.model", "Corolla")
        setValue("vehicleA.plateNumber", "XYZ 789")
        setValue("vehicleA.vin", "JT2BF22K1W0123456")
      } else if (vehicle && vehicle.id === "2") {
        setValue("vehicleA.make", "Volkswagen")
        setValue("vehicleA.model", "Golf")
        setValue("vehicleA.plateNumber", "ABC 123")
        setValue("vehicleA.vin", "WVWZZZ1KZAW123456")
      }
    }
  }

  const handleInsuranceSelect = (value: string) => {
    setSelectedInsurance(value)
    if (value === "new") {
      setIsNewInsurance(true)
      // Clear insurance fields
      setValue("vehicleA.insurance.company", "")
      setValue("vehicleA.insurance.policyNumber", "")
      setValue("vehicleA.insurance.validFrom", "")
      setValue("vehicleA.insurance.validTo", "")
      setValue("vehicleA.insurance.insuredName", "")
      setValue("vehicleA.insurance.insuredAddress", "")
    } else {
      setIsNewInsurance(false)
      // Simulate loading selected insurance data
      const insurance = MOCK_INSURANCE.find((i) => i.id === value)
      if (insurance && insurance.id === "1") {
        setValue("vehicleA.insurance.company", "ASITO")
        setValue("vehicleA.insurance.policyNumber", "12345678")
        setValue("vehicleA.insurance.validFrom", "2023-01-01")
        setValue("vehicleA.insurance.validTo", "2024-01-01")
        setValue("vehicleA.insurance.insuredName", "Ion Popescu")
        setValue("vehicleA.insurance.insuredAddress", "Str. Independenței 12, Chișinău")
      } else if (insurance && insurance.id === "2") {
        setValue("vehicleA.insurance.company", "MOLDASIG")
        setValue("vehicleA.insurance.policyNumber", "87654321")
        setValue("vehicleA.insurance.validFrom", "2023-03-15")
        setValue("vehicleA.insurance.validTo", "2024-03-15")
        setValue("vehicleA.insurance.insuredName", "Ion Popescu")
        setValue("vehicleA.insurance.insuredAddress", "Str. Independenței 12, Chișinău")
      }
    }
  }

  return (
    <div className="space-y-4 sm:space-y-8">
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-base sm:text-lg text-gray-900">Datele Vehiculului A (Dvs.)</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0 space-y-4 sm:space-y-6">
          <div className="space-y-3">
            <Label className="text-sm text-gray-700">Selectează vehiculul tău implicat</Label>
            <Select value={selectedVehicle} onValueChange={handleVehicleSelect}>
              <SelectTrigger className="border-gray-300 text-gray-900">
                <SelectValue placeholder="Alege un vehicul" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_VEHICLES.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.name}
                  </SelectItem>
                ))}
                <SelectItem value="new">Adaugă Vehicul Nou</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(isNewVehicle || selectedVehicle) && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle-a-make" className="text-sm text-gray-700">
                    Marcă
                  </Label>
                  <Input
                    id="vehicle-a-make"
                    {...register("vehicleA.make")}
                    placeholder="Ex: Toyota"
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicle-a-model" className="text-sm text-gray-700">
                    Model
                  </Label>
                  <Input
                    id="vehicle-a-model"
                    {...register("vehicleA.model")}
                    placeholder="Ex: Corolla"
                    className="border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle-a-plate" className="text-sm text-gray-700">
                    Nr. Înmatriculare
                  </Label>
                  <Input
                    id="vehicle-a-plate"
                    {...register("vehicleA.plateNumber")}
                    placeholder="Ex: XYZ 789"
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicle-a-vin" className="text-sm text-gray-700">
                    VIN (IDNV)
                  </Label>
                  <Input
                    id="vehicle-a-vin"
                    {...register("vehicleA.vin")}
                    placeholder="Ex: JT2BF22K1W0123456"
                    className="border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm text-gray-700">Vehiculul avea remorcă?</Label>
                <RadioGroup
                  value={hasTrailer ? "yes" : "no"}
                  onValueChange={(value) => {
                    setValue("vehicleA.hasTrailer", value === "yes")
                  }}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="trailer-yes" />
                    <Label htmlFor="trailer-yes" className="text-sm text-gray-700">
                      Da
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="trailer-no" />
                    <Label htmlFor="trailer-no" className="text-sm text-gray-700">
                      Nu
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {hasTrailer && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pl-4 sm:pl-6 border-l-2 border-gray-200">
                  <div className="space-y-2">
                    <Label htmlFor="trailer-plate" className="text-sm text-gray-700">
                      Nr. Înmatriculare Remorcă
                    </Label>
                    <Input
                      id="trailer-plate"
                      {...register("vehicleA.trailerPlate")}
                      placeholder="Ex: REM 123"
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trailer-vin" className="text-sm text-gray-700">
                      VIN Remorcă
                    </Label>
                    <Input
                      id="trailer-vin"
                      {...register("vehicleA.trailerVin")}
                      placeholder="Ex: TR123456789"
                      className="border-gray-300"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-base sm:text-lg text-gray-900">Datele Asigurării RCA</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0 space-y-4 sm:space-y-6">
          <div className="space-y-3">
            <Label className="text-sm text-gray-700">Selectează asigurarea RCA</Label>
            <Select value={selectedInsurance} onValueChange={handleInsuranceSelect}>
              <SelectTrigger className="border-gray-300 text-gray-900">
                <SelectValue placeholder="Alege o poliță RCA" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_INSURANCE.map((insurance) => (
                  <SelectItem key={insurance.id} value={insurance.id}>
                    {insurance.name}
                  </SelectItem>
                ))}
                <SelectItem value="new">Adaugă/Scanează Poliță RCA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(isNewInsurance || selectedInsurance) && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="insurance-company" className="text-sm text-gray-700">
                    Asigurător
                  </Label>
                  <Input
                    id="insurance-company"
                    {...register("vehicleA.insurance.company")}
                    placeholder="Ex: ASITO"
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insurance-policy" className="text-sm text-gray-700">
                    Poliță Nr.
                  </Label>
                  <Input
                    id="insurance-policy"
                    {...register("vehicleA.insurance.policyNumber")}
                    placeholder="Ex: 12345678"
                    className="border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="insurance-valid-from" className="text-sm text-gray-700">
                    Valabilitate de la
                  </Label>
                  <Input
                    id="insurance-valid-from"
                    type="date"
                    {...register("vehicleA.insurance.validFrom")}
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insurance-valid-to" className="text-sm text-gray-700">
                    Valabilitate până la
                  </Label>
                  <Input
                    id="insurance-valid-to"
                    type="date"
                    {...register("vehicleA.insurance.validTo")}
                    className="border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="insurance-insured-name" className="text-sm text-gray-700">
                  Nume Asigurat
                </Label>
                <Input
                  id="insurance-insured-name"
                  {...register("vehicleA.insurance.insuredName")}
                  placeholder="Ex: Ion Popescu"
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="insurance-insured-address" className="text-sm text-gray-700">
                  Adresă Asigurat
                </Label>
                <Input
                  id="insurance-insured-address"
                  {...register("vehicleA.insurance.insuredAddress")}
                  placeholder="Ex: Str. Independenței 12, Chișinău"
                  className="border-gray-300"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-base sm:text-lg text-gray-900">Datele Șoferului A (Dvs.)</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0 space-y-4 sm:space-y-6">
          <Button
            variant="outline"
            onClick={handleEvoImport}
            disabled={isLoadingEvo}
            className="w-full flex items-center justify-center gap-2 text-gray-700 border-gray-300"
          >
            {isLoadingEvo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Smartphone className="h-4 w-4" />}
            <span>Încarcă date din EVO/MConnect</span>
          </Button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="driver-a-first-name" className="text-sm text-gray-700">
                Prenume
              </Label>
              <Input
                id="driver-a-first-name"
                {...register("driverA.firstName")}
                placeholder="Prenume șofer"
                className="border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driver-a-last-name" className="text-sm text-gray-700">
                Nume
              </Label>
              <Input
                id="driver-a-last-name"
                {...register("driverA.lastName")}
                placeholder="Nume șofer"
                className="border-gray-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="driver-a-idnp" className="text-sm text-gray-700">
              IDNP
            </Label>
            <Input
              id="driver-a-idnp"
              {...register("driverA.idnp")}
              placeholder="Ex: 2002004123456"
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="driver-a-address" className="text-sm text-gray-700">
              Adresă
            </Label>
            <Input
              id="driver-a-address"
              {...register("driverA.address")}
              placeholder="Adresa șoferului"
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="driver-a-phone" className="text-sm text-gray-700">
              Telefon
            </Label>
            <Input
              id="driver-a-phone"
              {...register("driverA.phone")}
              placeholder="Ex: 069123456"
              className="border-gray-300"
            />
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3 text-gray-900 text-sm">Permis de Conducere</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="driver-a-license-number" className="text-sm text-gray-700">
                  Număr
                </Label>
                <Input
                  id="driver-a-license-number"
                  {...register("driverA.license.number")}
                  placeholder="Ex: MD123456"
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="driver-a-license-categories" className="text-sm text-gray-700">
                  Categorii
                </Label>
                <Input
                  id="driver-a-license-categories"
                  {...register("driverA.license.categories")}
                  placeholder="Ex: B, C"
                  className="border-gray-300"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
              <div className="space-y-2">
                <Label htmlFor="driver-a-license-issue-date" className="text-sm text-gray-700">
                  Data Emiterii
                </Label>
                <Input
                  id="driver-a-license-issue-date"
                  type="date"
                  {...register("driverA.license.issueDate")}
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="driver-a-license-expiry-date" className="text-sm text-gray-700">
                  Data Expirării
                </Label>
                <Input
                  id="driver-a-license-expiry-date"
                  type="date"
                  {...register("driverA.license.expiryDate")}
                  className="border-gray-300"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
