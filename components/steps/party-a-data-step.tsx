"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Smartphone, Edit2 } from "lucide-react"
import { useFormContext, useWatch } from "react-hook-form"
import type { AccidentFormData } from "@/lib/types"
import { useState, useEffect, useCallback } from "react"

const MOCK_VEHICLES = [
  { id: "1", name: "Toyota Corolla (XYZ 789)", make: "Toyota", model: "Corolla", plateNumber: "XYZ 789", vin: "JT2BF22K1W0123456", techInspectionValidUntil: "2024-10-15" },
  { id: "2", name: "Volkswagen Golf (ABC 123)", make: "Volkswagen", model: "Golf", plateNumber: "ABC 123", vin: "WVWZZZ1KZAW123456", techInspectionValidUntil: "2025-03-01" },
]

const MOCK_INSURANCE = [
  { id: "1", name: "ASITO - Poliță RCA 12345678", company: "ASITO", policyNumber: "12345678", validFrom: "2023-01-01", validTo: "2024-01-01", insuredName: "Ion Popescu", insuredAddress: "Str. Independenței 12, Chișinău" },
  { id: "2", name: "MOLDASIG - Poliță RCA 87654321", company: "MOLDASIG", policyNumber: "87654321", validFrom: "2023-03-15", validTo: "2024-03-15", insuredName: "Ion Popescu", insuredAddress: "Str. Independenței 12, Chișinău" },
]

// --- Mock CASCO Data ---
const MOCK_CASCO = [
  { id: "casco1", name: "GRAWE - CASCO C123", company: "GRAWE Carat", policyNumber: "C123", validTo: "2024-11-30" },
  { id: "casco2", name: "ASITO - CASCO C456", company: "ASITO", policyNumber: "C456", validTo: "2025-02-10" },
]

// Helper component for compact display
function ReadOnlyField({ label, value }: { label: string; value?: string }) {
  // Simple date formatter for DD.MM.YYYY
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr || !/\d{4}-\d{2}-\d{2}/.test(dateStr)) return dateStr || "-";
    try {
      return dateStr.split('-').reverse().join('.');
    } catch (e) {
      return dateStr; // Return original if format fails
    }
  };

  // Determine if the value likely represents a date (YYYY-MM-DD)
  const isDate = value && /\d{4}-\d{2}-\d{2}/.test(value);

  return (
    <div className="text-sm">
      <span className="text-gray-500">{label}: </span>
      <span className="text-gray-900 font-medium break-words">{isDate ? formatDate(value) : value || "-"}</span>
    </div>
  )
}

export default function PartyADataStep() {
  const { register, setValue, watch, control } = useFormContext<AccidentFormData>()
  const [isLoadingEvo, setIsLoadingEvo] = useState(false)
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("1")
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<string>("1")
  const [selectedCascoId, setSelectedCascoId] = useState<string>("")
  const [isEditingVehicle, setIsEditingVehicle] = useState(false)
  const [isEditingInsurance, setIsEditingInsurance] = useState(false)
  const [isEditingCasco, setIsEditingCasco] = useState(false)
  const [isAddingNewVehicle, setIsAddingNewVehicle] = useState(false)
  const [isAddingNewInsurance, setIsAddingNewInsurance] = useState(false)
  const [isAddingNewCasco, setIsAddingNewCasco] = useState(false)
  const [isEditingDriver, setIsEditingDriver] = useState(false)

  const hasTrailer = watch("vehicleA.hasTrailer")

  // --- Watched Values for Read-Only Displays ---
  const vehicleMake = useWatch({ control, name: "vehicleA.make" })
  const vehicleModel = useWatch({ control, name: "vehicleA.model" })
  const vehiclePlate = useWatch({ control, name: "vehicleA.plateNumber" })
  const vehicleVin = useWatch({ control, name: "vehicleA.vin" })
  const vehicleTechInspection = useWatch({ control, name: "vehicleA.techInspectionValidUntil" })
  const insuranceCompany = useWatch({ control, name: "vehicleA.insurance.company" })
  const insurancePolicy = useWatch({ control, name: "vehicleA.insurance.policyNumber" })
  const insuranceValidTo = useWatch({ control, name: "vehicleA.insurance.validTo"})
  const cascoCompany = useWatch({ control, name: "vehicleA.casco.company"})
  const cascoPolicy = useWatch({ control, name: "vehicleA.casco.policyNumber"})
  const cascoValidTo = useWatch({ control, name: "vehicleA.casco.validTo"})
  const driverFirstName = useWatch({ control, name: "driverA.firstName"})
  const driverLastName = useWatch({ control, name: "driverA.lastName"})
  const driverIdnp = useWatch({ control, name: "driverA.idnp"})
  const driverPhone = useWatch({ control, name: "driverA.phone"})
  const driverLicenseNumber = useWatch({ control, name: "driverA.license.number"})

  // --- Data Prefill Logic ---
  const prefillVehicleData = useCallback(
    (vehicleId: string) => {
      const vehicle = MOCK_VEHICLES.find((v) => v.id === vehicleId)
      if (vehicle) {
        setValue("vehicleA.make", vehicle.make)
        setValue("vehicleA.model", vehicle.model)
        setValue("vehicleA.plateNumber", vehicle.plateNumber)
        setValue("vehicleA.vin", vehicle.vin)
        setValue("vehicleA.techInspectionValidUntil", vehicle.techInspectionValidUntil)
        // Don't reset trailer here, keep existing value
      }
    },
    [setValue]
  )

  const prefillInsuranceData = useCallback(
    (insuranceId: string) => {
      const insurance = MOCK_INSURANCE.find((i) => i.id === insuranceId)
      if (insurance) {
        setValue("vehicleA.insurance.company", insurance.company)
        setValue("vehicleA.insurance.policyNumber", insurance.policyNumber)
        setValue("vehicleA.insurance.validFrom", insurance.validFrom)
        setValue("vehicleA.insurance.validTo", insurance.validTo)
        setValue("vehicleA.insurance.insuredName", insurance.insuredName)
        setValue("vehicleA.insurance.insuredAddress", insurance.insuredAddress)
      }
    },
    [setValue]
  )

  const prefillCascoData = useCallback(
    (cascoId: string) => {
      const casco = MOCK_CASCO.find((c) => c.id === cascoId)
      if (casco) {
        setValue("vehicleA.casco.company", casco.company)
        setValue("vehicleA.casco.policyNumber", casco.policyNumber)
        setValue("vehicleA.casco.validTo", casco.validTo)
      } else {
        setValue("vehicleA.casco.company", "")
        setValue("vehicleA.casco.policyNumber", "")
        setValue("vehicleA.casco.validTo", "")
      }
    },
    [setValue]
  )

 const prefillDriverData = useCallback(() => {
     setValue("driverA.firstName", "Ion")
     setValue("driverA.lastName", "Popescu")
     setValue("driverA.idnp", "2002004123456")
     setValue("driverA.address", "Str. Independenței 12, Chișinău")
     setValue("driverA.phone", "069123456")
     setValue("driverA.license.number", "MD123456")
     setValue("driverA.license.categories", "B")
     setValue("driverA.license.issueDate", "2015-06-15")
     setValue("driverA.license.expiryDate", "2025-06-15")
 }, [setValue])


  // Prefill data on initial mount
  useEffect(() => {
    if (!isAddingNewVehicle) prefillVehicleData(selectedVehicleId)
    if (!isAddingNewInsurance) prefillInsuranceData(selectedInsuranceId)
    if (!isAddingNewCasco) prefillCascoData(selectedCascoId)
    if (!isEditingDriver) prefillDriverData()

  }, [
      setValue, prefillVehicleData, prefillInsuranceData, prefillCascoData, prefillDriverData,
      selectedVehicleId, selectedInsuranceId, selectedCascoId,
      isAddingNewVehicle, isAddingNewInsurance, isAddingNewCasco, isEditingDriver
  ])

  // --- Event Handlers ---
  const handleEvoImport = () => {
    setIsLoadingEvo(true)
    setTimeout(() => {
      prefillDriverData()
      setIsLoadingEvo(false)
    }, 1500)
  }

  const handleVehicleSelect = (value: string) => {
    if (value === "new") {
      setIsAddingNewVehicle(true)
      setIsEditingVehicle(false)
      setSelectedVehicleId("")
      setValue("vehicleA.make", "")
      setValue("vehicleA.model", "")
      setValue("vehicleA.plateNumber", "")
      setValue("vehicleA.vin", "")
      setValue("vehicleA.techInspectionValidUntil", "")
      setValue("vehicleA.hasTrailer", false)
      setValue("vehicleA.trailerPlate", "")
      setValue("vehicleA.trailerVin", "")
    } else {
      setSelectedVehicleId(value)
      prefillVehicleData(value)
      setIsAddingNewVehicle(false)
      setIsEditingVehicle(false)
    }
  }

   const handleCancelAddVehicle = () => {
        setIsAddingNewVehicle(false);
        const targetId = MOCK_VEHICLES[0]?.id || "";
        setSelectedVehicleId(targetId);
        if (targetId) prefillVehicleData(targetId);
   }


  const handleInsuranceSelect = (value: string) => {
    if (value === "new") {
      setIsAddingNewInsurance(true)
      setIsEditingInsurance(false)
      setSelectedInsuranceId("")
      setValue("vehicleA.insurance.company", "")
      setValue("vehicleA.insurance.policyNumber", "")
      setValue("vehicleA.insurance.validFrom", "")
      setValue("vehicleA.insurance.validTo", "")
      setValue("vehicleA.insurance.insuredName", "")
      setValue("vehicleA.insurance.insuredAddress", "")
    } else {
      setSelectedInsuranceId(value)
      prefillInsuranceData(value)
      setIsAddingNewInsurance(false)
      setIsEditingInsurance(false)
    }
  }

  const handleCancelAddInsurance = () => {
        setIsAddingNewInsurance(false);
        const targetId = MOCK_INSURANCE[0]?.id || "";
        setSelectedInsuranceId(targetId);
        if (targetId) prefillInsuranceData(targetId);
   }

  // --- CASCO Event Handlers ---
  const handleCascoSelect = (value: string) => {
    if (value === "new") {
      setIsAddingNewCasco(true)
      setIsEditingCasco(false)
      setSelectedCascoId("")
      setValue("vehicleA.casco.company", "")
      setValue("vehicleA.casco.policyNumber", "")
      setValue("vehicleA.casco.validTo", "")
    } else if (value === "none") {
      setSelectedCascoId("")
      prefillCascoData("")
      setIsAddingNewCasco(false)
      setIsEditingCasco(false)
    } else {
      setSelectedCascoId(value)
      prefillCascoData(value)
      setIsAddingNewCasco(false)
      setIsEditingCasco(false)
    }
  }

  const handleCancelAddCasco = () => {
    setIsAddingNewCasco(false);
    const targetId = "";
    setSelectedCascoId(targetId);
    prefillCascoData(targetId);
  }

  // --- Trailer Section ---
  const renderTrailerSection = () => (
      <div className={`pt-2 ${isAddingNewVehicle ? 'mt-2' : ''}`}>
          <Label className="text-sm text-gray-700 block mb-1.5">Vehiculul avea remorcă?</Label>
          <RadioGroup
              value={hasTrailer ? "yes" : "no"}
              onValueChange={(value) => { setValue("vehicleA.hasTrailer", value === "yes") }}
              className="flex flex-row space-x-4 pt-1"
          >
              <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="trailer-yes" />
                  <Label htmlFor="trailer-yes" className="text-sm font-normal text-gray-700">Da</Label>
              </div>
              <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="trailer-no" />
                  <Label htmlFor="trailer-no" className="text-sm font-normal text-gray-700">Nu</Label>
              </div>
          </RadioGroup>

          {hasTrailer && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4 border-l-2 border-gray-200 mt-2 pt-2 pb-1">
                  <div className="space-y-1">
                      <Label htmlFor="trailer-plate" className="text-sm text-gray-700">Nr. Înmatriculare Remorcă</Label>
                      <Input id="trailer-plate" {...register("vehicleA.trailerPlate")} placeholder="Ex: REM 123" className="border-gray-300 text-sm h-9" />
                  </div>
                  <div className="space-y-1">
                      <Label htmlFor="trailer-vin" className="text-sm text-gray-700">VIN Remorcă</Label>
                      <Input id="trailer-vin" {...register("vehicleA.trailerVin")} placeholder="Ex: TR123456789" className="border-gray-300 text-sm h-9" />
                  </div>
              </div>
          )}
      </div>
  );

  // --- Vehicle Card Content ---
  const renderVehicleContent = () => {
    if (isAddingNewVehicle) {
      // Render input fields for adding a new vehicle
      return (
        <>
          <div className="flex justify-end mb-2 -mt-1">
             <Button variant="ghost" size="sm" className="h-7 text-xs text-red-600 hover:text-red-700" onClick={handleCancelAddVehicle}>Anulează Adăugarea</Button>
          </div>
          {renderVehicleInputs()}
          {renderTrailerSection()}
        </>
      )
    }

    if (isEditingVehicle) {
      // Render Select dropdown for changing vehicle
      return (
        <div className="space-y-1.5">
          <Label className="text-sm text-gray-700">Selectează alt vehicul</Label>
          <Select value={selectedVehicleId} onValueChange={handleVehicleSelect}>
            <SelectTrigger className="border-gray-300 text-gray-900 text-sm h-9">
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
           <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setIsEditingVehicle(false)}>Anulează</Button>
        </div>
      )
    }

    // Render compact read-only view
    return (
      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <div className="space-y-0.5 flex-1 mr-2">
             <ReadOnlyField label="Marcă" value={vehicleMake} />
             <ReadOnlyField label="Model" value={vehicleModel} />
             <ReadOnlyField label="Nr. Înmatriculare" value={vehiclePlate} />
             <ReadOnlyField label="VIN" value={vehicleVin} />
             <ReadOnlyField label="Revizie Tehnică" value={vehicleTechInspection} />
          </div>
          <Button variant="outline" size="sm" className="h-7 text-xs px-2 flex-shrink-0" onClick={() => setIsEditingVehicle(true)}>
            <Edit2 className="h-3 w-3 mr-1" /> Schimbă
          </Button>
        </div>
         {renderTrailerSection()}
      </div>
    )
  }

  // --- Insurance Card Content ---
   const renderInsuranceContent = () => {
     if (isAddingNewInsurance) {
       return (
         <>
           <div className="flex justify-end mb-2 -mt-1">
              <Button variant="ghost" size="sm" className="h-7 text-xs text-red-600 hover:text-red-700" onClick={handleCancelAddInsurance}>Anulează Adăugarea</Button>
           </div>
           {renderInsuranceInputs()}
         </>
       )
     }

     if (isEditingInsurance) {
       return (
         <div className="space-y-1.5">
           <Label className="text-sm text-gray-700">Selectează altă asigurare</Label>
           <Select value={selectedInsuranceId} onValueChange={handleInsuranceSelect}>
             <SelectTrigger className="border-gray-300 text-gray-900 text-sm h-9">
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
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setIsEditingInsurance(false)}>Anulează</Button>
         </div>
       )
     }

     // Render compact read-only view
     return (
       <div className="space-y-1">
         <div className="flex justify-between items-start">
            <div className="space-y-0.5 flex-1 mr-2">
              <ReadOnlyField label="Asigurător" value={insuranceCompany} />
              <ReadOnlyField label="Poliță Nr." value={insurancePolicy} />
              <ReadOnlyField label="Valabilă până la" value={insuranceValidTo} />
            </div>
           <Button variant="outline" size="sm" className="h-7 text-xs px-2 flex-shrink-0" onClick={() => setIsEditingInsurance(true)}>
             <Edit2 className="h-3 w-3 mr-1" /> Schimbă
           </Button>
         </div>
       </div>
     )
   }

   // --- CASCO Card Content ---
   const renderCascoContent = () => {
     if (isAddingNewCasco) {
       return (
         <>
           <div className="flex justify-end mb-2 -mt-1">
              <Button variant="ghost" size="sm" className="h-7 text-xs text-red-600 hover:text-red-700" onClick={handleCancelAddCasco}>Anulează Adăugarea</Button>
           </div>
           {renderCascoInputs()}
         </>
       )
     }

     if (isEditingCasco) {
       return (
         <div className="space-y-1.5">
           <Label className="text-sm text-gray-700">Selectează CASCO</Label>
           <Select value={selectedCascoId} onValueChange={handleCascoSelect}>
             <SelectTrigger className="border-gray-300 text-gray-900 text-sm h-9">
               <SelectValue placeholder="Alege o poliță CASCO" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="none">Niciuna</SelectItem>
               {MOCK_CASCO.map((casco) => (
                 <SelectItem key={casco.id} value={casco.id}>
                   {casco.name}
                 </SelectItem>
               ))}
               <SelectItem value="new">Adaugă Poliță CASCO</SelectItem>
             </SelectContent>
           </Select>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setIsEditingCasco(false)}>Anulează</Button>
         </div>
       )
     }

     // Render compact read-only view
     return (
       <div className="space-y-1">
         <div className="flex justify-between items-start">
            <div className="space-y-0.5 flex-1 mr-2">
              <ReadOnlyField label="Asigurător CASCO" value={cascoCompany} />
              <ReadOnlyField label="Poliță Nr." value={cascoPolicy} />
              <ReadOnlyField label="Valabilă până la" value={cascoValidTo} />
            </div>
           <Button variant="outline" size="sm" className="h-7 text-xs px-2 flex-shrink-0" onClick={() => setIsEditingCasco(true)}>
             <Edit2 className="h-3 w-3 mr-1" /> {selectedCascoId ? 'Schimbă' : 'Adaugă'}
           </Button>
         </div>
       </div>
     )
   }

  // --- Driver Card Content ---
  const renderDriverContent = () => {
    if (isEditingDriver) {
      // Render inputs for editing driver
      return (
          <>
              <div className="flex justify-between items-center mb-3">
                  <Button
                      variant="outline"
                      onClick={handleEvoImport}
                      disabled={isLoadingEvo}
                      className="flex items-center justify-center gap-2 text-gray-700 border-gray-300 text-sm h-9"
                  >
                      {isLoadingEvo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Smartphone className="h-4 w-4" />}
                      <span>Încarcă date din EVO/MConnect</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setIsEditingDriver(false)}>Anulează</Button>
              </div>
              {renderDriverInputs()}
          </>
      )
    }

    // Render compact read-only view for driver
    return (
      <div className="space-y-1">
          <div className="flex justify-between items-start">
              <div className="space-y-0.5 flex-1 mr-2">
                  <ReadOnlyField label="Nume" value={`${driverFirstName || ''} ${driverLastName || ''}`.trim() || '-'} />
                  <ReadOnlyField label="IDNP" value={driverIdnp} />
                  <ReadOnlyField label="Telefon" value={driverPhone} />
                  <ReadOnlyField label="Permis Nr." value={driverLicenseNumber} />
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs px-2 flex-shrink-0" onClick={() => setIsEditingDriver(true)}>
                  <Edit2 className="h-3 w-3 mr-1" /> Schimbă
              </Button>
          </div>
      </div>
    )
  }


  // --- Reusable Input Field Sections ---
  const renderVehicleInputs = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label htmlFor="vehicle-a-make" className="text-sm text-gray-700">Marcă</Label>
          <Input id="vehicle-a-make" {...register("vehicleA.make")} placeholder="Ex: Toyota" className="border-gray-300 text-sm h-9" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="vehicle-a-model" className="text-sm text-gray-700">Model</Label>
          <Input id="vehicle-a-model" {...register("vehicleA.model")} placeholder="Ex: Corolla" className="border-gray-300 text-sm h-9" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label htmlFor="vehicle-a-plate" className="text-sm text-gray-700">Nr. Înmatriculare</Label>
          <Input id="vehicle-a-plate" {...register("vehicleA.plateNumber")} placeholder="Ex: XYZ 789" className="border-gray-300 text-sm h-9" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="vehicle-a-vin" className="text-sm text-gray-700">VIN (IDNV)</Label>
          <Input id="vehicle-a-vin" {...register("vehicleA.vin")} placeholder="Ex: JT2BF22K1W0123456" className="border-gray-300 text-sm h-9" />
        </div>
      </div>
      <div className="space-y-1 pt-1">
          <Label htmlFor="vehicle-a-tech-inspection" className="text-sm text-gray-700">Revizia Tehnică Valabilă Până La</Label>
          <Input id="vehicle-a-tech-inspection" type="date" {...register("vehicleA.techInspectionValidUntil")} className="border-gray-300 text-sm h-9" />
       </div>
    </>
  )

  const renderInsuranceInputs = () => (
     <>
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
         <div className="space-y-1">
           <Label htmlFor="insurance-company" className="text-sm text-gray-700">Asigurător</Label>
           <Input id="insurance-company" {...register("vehicleA.insurance.company")} placeholder="Ex: ASITO" className="border-gray-300 text-sm h-9" />
         </div>
         <div className="space-y-1">
           <Label htmlFor="insurance-policy" className="text-sm text-gray-700">Poliță Nr.</Label>
           <Input id="insurance-policy" {...register("vehicleA.insurance.policyNumber")} placeholder="Ex: 12345678" className="border-gray-300 text-sm h-9" />
         </div>
       </div>
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
         <div className="space-y-1">
           <Label htmlFor="insurance-valid-from" className="text-sm text-gray-700">Valabilitate de la</Label>
           <Input id="insurance-valid-from" type="date" {...register("vehicleA.insurance.validFrom")} className="border-gray-300 text-sm h-9" />
         </div>
         <div className="space-y-1">
           <Label htmlFor="insurance-valid-to" className="text-sm text-gray-700">Valabilitate până la</Label>
           <Input id="insurance-valid-to" type="date" {...register("vehicleA.insurance.validTo")} className="border-gray-300 text-sm h-9" />
         </div>
       </div>
       <div className="space-y-1">
         <Label htmlFor="insurance-insured-name" className="text-sm text-gray-700">Nume Asigurat</Label>
         <Input id="insurance-insured-name" {...register("vehicleA.insurance.insuredName")} placeholder="Ex: Ion Popescu" className="border-gray-300 text-sm h-9" />
       </div>
       <div className="space-y-1">
         <Label htmlFor="insurance-insured-address" className="text-sm text-gray-700">Adresă Asigurat</Label>
         <Input id="insurance-insured-address" {...register("vehicleA.insurance.insuredAddress")} placeholder="Ex: Str. Independenței 12, Chișinău" className="border-gray-300 text-sm h-9" />
       </div>
     </>
   )

   const renderCascoInputs = () => (
     <>
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
         <div className="space-y-1">
           <Label htmlFor="casco-company" className="text-sm text-gray-700">Asigurător CASCO</Label>
           <Input id="casco-company" {...register("vehicleA.casco.company")} placeholder="Ex: GRAWE Carat" className="border-gray-300 text-sm h-9" />
         </div>
         <div className="space-y-1">
           <Label htmlFor="casco-policy" className="text-sm text-gray-700">Poliță Nr.</Label>
           <Input id="casco-policy" {...register("vehicleA.casco.policyNumber")} placeholder="Ex: C123" className="border-gray-300 text-sm h-9" />
         </div>
       </div>
       <div className="space-y-1">
         <Label htmlFor="casco-valid-to" className="text-sm text-gray-700">Valabilitate până la</Label>
         <Input id="casco-valid-to" type="date" {...register("vehicleA.casco.validTo")} className="border-gray-300 text-sm h-9" />
       </div>
     </>
   )

   const renderDriverInputs = () => (
       <div className="space-y-3">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
               <div className="space-y-1">
                   <Label htmlFor="driver-a-first-name" className="text-sm text-gray-700">Prenume</Label>
                   <Input id="driver-a-first-name" {...register("driverA.firstName")} placeholder="Prenume șofer" className="border-gray-300 text-sm h-9" />
               </div>
               <div className="space-y-1">
                   <Label htmlFor="driver-a-last-name" className="text-sm text-gray-700">Nume</Label>
                   <Input id="driver-a-last-name" {...register("driverA.lastName")} placeholder="Nume șofer" className="border-gray-300 text-sm h-9" />
               </div>
           </div>
           <div className="space-y-1">
               <Label htmlFor="driver-a-idnp" className="text-sm text-gray-700">IDNP</Label>
               <Input id="driver-a-idnp" {...register("driverA.idnp")} placeholder="Ex: 2002004123456" className="border-gray-300 text-sm h-9" />
           </div>
           <div className="space-y-1">
               <Label htmlFor="driver-a-address" className="text-sm text-gray-700">Adresă</Label>
               <Input id="driver-a-address" {...register("driverA.address")} placeholder="Adresa șoferului" className="border-gray-300 text-sm h-9" />
           </div>
           <div className="space-y-1">
               <Label htmlFor="driver-a-phone" className="text-sm text-gray-700">Telefon</Label>
               <Input id="driver-a-phone" {...register("driverA.phone")} placeholder="Ex: 069123456" className="border-gray-300 text-sm h-9" />
           </div>
           <div className="border-t pt-3 mt-3">
               <h4 className="font-medium mb-2 text-gray-900 text-sm">Permis de Conducere</h4>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                   <div className="space-y-1">
                       <Label htmlFor="driver-a-license-number" className="text-sm text-gray-700">Număr</Label>
                       <Input id="driver-a-license-number" {...register("driverA.license.number")} placeholder="Ex: MD123456" className="border-gray-300 text-sm h-9" />
                   </div>
                   <div className="space-y-1">
                       <Label htmlFor="driver-a-license-categories" className="text-sm text-gray-700">Categorii</Label>
                       <Input id="driver-a-license-categories" {...register("driverA.license.categories")} placeholder="Ex: B, C" className="border-gray-300 text-sm h-9" />
                   </div>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                   <div className="space-y-1">
                       <Label htmlFor="driver-a-license-issue-date" className="text-sm text-gray-700">Data Emiterii</Label>
                       <Input id="driver-a-license-issue-date" type="date" {...register("driverA.license.issueDate")} className="border-gray-300 text-sm h-9" />
                   </div>
                   <div className="space-y-1">
                       <Label htmlFor="driver-a-license-expiry-date" className="text-sm text-gray-700">Data Expirării</Label>
                       <Input id="driver-a-license-expiry-date" type="date" {...register("driverA.license.expiryDate")} className="border-gray-300 text-sm h-9" />
                   </div>
               </div>
           </div>
       </div>
   )


  // --- Main Component Return ---
  return (
    <div className="space-y-4 p-4 rounded-lg" style={{ backgroundColor: '#E8F0FB' }}>
      {/* Vehicle Card */}
      <Card className="shadow-sm border-gray-200" style={{ backgroundColor: '#D6E5F8' }}>
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-base font-semibold text-gray-900">Vehiculul A (Dvs.)</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 pt-2 space-y-3">
          {renderVehicleContent()}
        </CardContent>
      </Card>

      {/* Insurance Card */}
      <Card className="shadow-sm border-gray-200" style={{ backgroundColor: '#D6E5F8' }}>
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-base font-semibold text-gray-900">Asigurarea RCA</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 pt-2 space-y-3">
           {renderInsuranceContent()}
        </CardContent>
      </Card>

      {/* CASCO Card */}
      <Card className="shadow-sm border-gray-200" style={{ backgroundColor: '#D6E5F8' }}>
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-base font-semibold text-gray-900">Asigurare CASCO (Opțional)</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 pt-2 space-y-3">
           {renderCascoContent()}
        </CardContent>
      </Card>

      {/* Driver Card */}
      <Card className="shadow-sm border-gray-200" style={{ backgroundColor: '#D6E5F8' }}>
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-base font-semibold text-gray-900">Șoferul A (Dvs.)</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 pt-2 space-y-3">
           {renderDriverContent()}
        </CardContent>
      </Card>
    </div>
  )
}

