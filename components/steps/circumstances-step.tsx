"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { type AccidentFormData, ROAD_CONDITIONS, VEHICLE_ACTIONS } from "@/lib/types"
import { useState } from "react"

export default function CircumstancesStep() {
  const { setValue, watch } = useFormContext<AccidentFormData>()
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])

  const vehicleAStatus = watch("circumstances.vehicleAStatus")
  const vehicleBStatus = watch("circumstances.vehicleBStatus")
  const vehicleAAction = watch("circumstances.vehicleAAction")
  const vehicleBAction = watch("circumstances.vehicleBAction")

  const handleAddCondition = (condition: string) => {
    if (!selectedConditions.includes(condition)) {
      const newConditions = [...selectedConditions, condition]
      setSelectedConditions(newConditions)
      setValue("circumstances.roadConditions", newConditions)
    }
  }

  const handleRemoveCondition = (condition: string) => {
    const newConditions = selectedConditions.filter((c) => c !== condition)
    setSelectedConditions(newConditions)
    setValue("circumstances.roadConditions", newConditions)
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6 sm:space-y-8">
        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-base sm:text-lg font-medium text-gray-900">
            Circumstanțele Accidentului - Vehiculul A (Dvs.)
          </h3>

          <div className="space-y-4">
            <Label>Cum se deplasa vehiculul Dvs. (A) în momentul impactului?</Label>
            <RadioGroup
              value={vehicleAStatus}
              onValueChange={(value: "stationary" | "moving") => {
                setValue("circumstances.vehicleAStatus", value)
                setValue("circumstances.vehicleAAction", undefined)
              }}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="stationary" id="vehicle-a-stationary" />
                <Label htmlFor="vehicle-a-stationary">Era staționar / oprit</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moving" id="vehicle-a-moving" />
                <Label htmlFor="vehicle-a-moving">Era în mișcare</Label>
              </div>
            </RadioGroup>
          </div>

          {vehicleAStatus === "stationary" && (
            <div className="space-y-4 pl-6 border-l-2 border-gray-200">
              <Label>Cum era poziționat vehiculul Dvs.?</Label>
              <RadioGroup
                value={vehicleAAction}
                onValueChange={(value) => {
                  setValue("circumstances.vehicleAAction", value)
                }}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="parked-legally" id="vehicle-a-parked-legally" />
                  <Label htmlFor="vehicle-a-parked-legally">Staționa regulamentar</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="parked-illegally" id="vehicle-a-parked-illegally" />
                  <Label htmlFor="vehicle-a-parked-illegally">Staționa neregulamentar</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="stopped-at-signal" id="vehicle-a-stopped-at-signal" />
                  <Label htmlFor="vehicle-a-stopped-at-signal">Oprit la semnalul de interzicere</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="door-opening" id="vehicle-a-door-opening" />
                  <Label htmlFor="vehicle-a-door-opening">Pornire de pe loc / Deschidea ușa</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {vehicleAStatus === "moving" && (
            <div className="space-y-4 pl-6 border-l-2 border-gray-200">
              <Label>Ce acțiune principală efectuați?</Label>
              <Select
                value={vehicleAAction}
                onValueChange={(value) => {
                  setValue("circumstances.vehicleAAction", value)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selectați acțiunea" />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_ACTIONS.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-base sm:text-lg font-medium text-gray-900">Circumstanțele Accidentului - Vehiculul B</h3>

          <div className="space-y-4">
            <Label>Cum se deplasa vehiculul B în momentul impactului?</Label>
            <RadioGroup
              value={vehicleBStatus}
              onValueChange={(value: "stationary" | "moving") => {
                setValue("circumstances.vehicleBStatus", value)
                setValue("circumstances.vehicleBAction", undefined)
              }}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="stationary" id="vehicle-b-stationary" />
                <Label htmlFor="vehicle-b-stationary">Era staționar / oprit</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moving" id="vehicle-b-moving" />
                <Label htmlFor="vehicle-b-moving">Era în mișcare</Label>
              </div>
            </RadioGroup>
          </div>

          {vehicleBStatus === "stationary" && (
            <div className="space-y-4 pl-6 border-l-2 border-gray-200">
              <Label>Cum era poziționat vehiculul B?</Label>
              <RadioGroup
                value={vehicleBAction}
                onValueChange={(value) => {
                  setValue("circumstances.vehicleBAction", value)
                }}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="parked-legally" id="vehicle-b-parked-legally" />
                  <Label htmlFor="vehicle-b-parked-legally">Staționa regulamentar</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="parked-illegally" id="vehicle-b-parked-illegally" />
                  <Label htmlFor="vehicle-b-parked-illegally">Staționa neregulamentar</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="stopped-at-signal" id="vehicle-b-stopped-at-signal" />
                  <Label htmlFor="vehicle-b-stopped-at-signal">Oprit la semnalul de interzicere</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="door-opening" id="vehicle-b-door-opening" />
                  <Label htmlFor="vehicle-b-door-opening">Pornire de pe loc / Deschidea ușa</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {vehicleBStatus === "moving" && (
            <div className="space-y-4 pl-6 border-l-2 border-gray-200">
              <Label>Ce acțiune principală efectua?</Label>
              <Select
                value={vehicleBAction}
                onValueChange={(value) => {
                  setValue("circumstances.vehicleBAction", value)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selectați acțiunea" />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_ACTIONS.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Condiții de drum</Label>
        <Select onValueChange={handleAddCondition}>
          <SelectTrigger>
            <SelectValue placeholder="Selectați condițiile de drum" />
          </SelectTrigger>
          <SelectContent>
            {ROAD_CONDITIONS.map((condition) => (
              <SelectItem key={condition} value={condition}>
                {condition}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex flex-wrap gap-2 mt-2">
          {selectedConditions.map((condition) => (
            <Badge key={condition} variant="secondary" className="flex items-center gap-1 bg-gray-100 text-gray-700">
              {condition}
              <button
                type="button"
                onClick={() => handleRemoveCondition(condition)}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
