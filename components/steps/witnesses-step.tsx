"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Plus, Trash2 } from "lucide-react"
import { useFormContext } from "react-hook-form"
import type { AccidentFormData, Witness } from "@/lib/types"
import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"

export default function WitnessesStep() {
  const { register, setValue, getValues, watch } = useFormContext<AccidentFormData>()
  const [witnesses, setWitnesses] = useState<Witness[]>([])

  const hasWitnesses = watch("witnesses.hasWitnesses")

  useEffect(() => {
    const existingWitnesses = getValues("witnesses.list")
    if (existingWitnesses && existingWitnesses.length > 0) {
      setWitnesses(existingWitnesses)
    }
  }, [getValues])

  const addWitness = () => {
    const newWitness: Witness = {
      id: uuidv4(),
      firstName: "",
      lastName: "",
      address: "",
      phone: "",
    }
    const updatedWitnesses = [...witnesses, newWitness]
    setWitnesses(updatedWitnesses)
    setValue("witnesses.list", updatedWitnesses)
  }

  const removeWitness = (id: string) => {
    const updatedWitnesses = witnesses.filter((w) => w.id !== id)
    setWitnesses(updatedWitnesses)
    setValue("witnesses.list", updatedWitnesses)
  }

  const updateWitness = (id: string, field: keyof Witness, value: string) => {
    const updatedWitnesses = witnesses.map((w) => (w.id === id ? { ...w, [field]: value } : w))
    setWitnesses(updatedWitnesses)
    setValue("witnesses.list", updatedWitnesses)
  }

  useEffect(() => {
    if (hasWitnesses === false) {
      setWitnesses([])
      setValue("witnesses.list", [])
    } else if (hasWitnesses === true && witnesses.length === 0) {
      addWitness()
    }
  }, [hasWitnesses, setValue])

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Martori</h3>
        <p className="text-gray-600">Dacă există martori la accident, adăugați datele lor de contact.</p>

        <div className="space-y-3">
          <Label>Există martori?</Label>
          <RadioGroup
            value={hasWitnesses === undefined ? undefined : hasWitnesses ? "yes" : "no"}
            onValueChange={(value) => {
              setValue("witnesses.hasWitnesses", value === "yes")
            }}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="witnesses-yes" />
              <Label htmlFor="witnesses-yes">Da</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="witnesses-no" />
              <Label htmlFor="witnesses-no">Nu</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {hasWitnesses && (
        <div className="space-y-6">
          {witnesses.map((witness, index) => (
            <div key={witness.id} className="border rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4 relative">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Martor {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeWitness(witness.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`witness-${witness.id}-firstName`}>Prenume</Label>
                  <Input
                    id={`witness-${witness.id}-firstName`}
                    value={witness.firstName}
                    onChange={(e) => updateWitness(witness.id, "firstName", e.target.value)}
                    placeholder="Prenume martor"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`witness-${witness.id}-lastName`}>Nume</Label>
                  <Input
                    id={`witness-${witness.id}-lastName`}
                    value={witness.lastName}
                    onChange={(e) => updateWitness(witness.id, "lastName", e.target.value)}
                    placeholder="Nume martor"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`witness-${witness.id}-address`}>Adresă</Label>
                <Input
                  id={`witness-${witness.id}-address`}
                  value={witness.address}
                  onChange={(e) => updateWitness(witness.id, "address", e.target.value)}
                  placeholder="Adresa martorului"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`witness-${witness.id}-phone`}>Telefon</Label>
                <Input
                  id={`witness-${witness.id}-phone`}
                  value={witness.phone}
                  onChange={(e) => updateWitness(witness.id, "phone", e.target.value)}
                  placeholder="Număr de telefon"
                />
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addWitness}
            className="w-full flex items-center justify-center gap-2 text-gray-700"
          >
            <Plus className="h-4 w-4" />
            Adaugă alt martor
          </Button>
        </div>
      )}
    </div>
  )
}
