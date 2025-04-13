"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, MapPin } from "lucide-react"
import { useFormContext } from "react-hook-form"
import type { AccidentFormData } from "@/lib/types"
import { useState } from "react"

export default function DateLocationStep() {
  const { register, setValue, getValues } = useFormContext<AccidentFormData>()
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)

  const handleUseCurrentLocation = () => {
    setIsLoadingLocation(true)
    // Simulate fetching location
    setTimeout(() => {
      setValue("location.city", "Chișinău")
      setValue("location.street", "Bulevardul Ștefan cel Mare și Sfânt")
      setValue("location.number", "162")
      setIsLoadingLocation(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Data și Ora Accidentului</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input id="date" type="date" {...register("dateTime.date")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Ora</Label>
            <Input id="time" type="time" {...register("dateTime.time")} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Locația Accidentului</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUseCurrentLocation}
            disabled={isLoadingLocation}
            className="flex items-center gap-1 text-sm text-gray-700 ml-auto"
          >
            {isLoadingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
            <span className="hidden sm:inline">Folosește Locația Curentă</span>
            <span className="sm:hidden">Locația Curentă</span>
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="city">Localitate</Label>
            <Input id="city" placeholder="Ex: Chișinău" {...register("location.city")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="street">Stradă</Label>
            <Input id="street" placeholder="Ex: Bulevardul Ștefan cel Mare" {...register("location.street")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="number">Nr. / Bornă Kilometrică (opțional)</Label>
            <Input id="number" placeholder="Ex: 42 sau km 12+500" {...register("location.number")} />
          </div>
        </div>
      </div>
    </div>
  )
}
