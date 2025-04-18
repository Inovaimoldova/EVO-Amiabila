"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useFormContext } from "react-hook-form"
import type { AccidentFormData } from "@/lib/types"

export default function ResponsibilityNotesStep() {
  const { register, setValue, watch, getValues } = useFormContext<AccidentFormData>()

  const responsibility = watch("responsibility.party")
  const driverAName = `${getValues("driverA.firstName")} ${getValues("driverA.lastName")}`
  const driverBName = "Celălalt șofer" // Assuming we don't have this data yet

  return (
    <div className="space-y-6 sm:space-y-8 p-4 rounded-lg" style={{ backgroundColor: '#E8F0FB' }}>
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recunoașterea Responsabilității</h3>
        <p className="text-sm text-gray-700">
          Indicați care conducător auto își recunoaște responsabilitatea pentru accident.
        </p>

        <RadioGroup
          value={responsibility}
          onValueChange={(value: "A" | "B") => {
            setValue("responsibility.party", value)
          }}
          className=""
        >
          <div className="flex items-start space-x-2 py-4">
            <RadioGroupItem value="A" id="responsibility-a" className="mt-1" />
            <div>
              <Label htmlFor="responsibility-a" className="font-medium text-gray-900 text-sm">
                Conducătorul Vehiculului <span className="font-semibold">A</span> <span className="font-semibold">(Eu)</span>
              </Label>
              {responsibility === "A" && (
                <Card className="p-3 mt-1 bg-blue-sky-50 border-blue-sky-200" style={{ backgroundColor: '#D6E5F8' }}>
                  <p className="text-xs sm:text-sm text-blue-sky-800">
                    Eu, <span className="font-medium">{driverAName || "Șoferul A"}</span>, recunosc că sunt responsabil
                    pentru producerea acestui accident.
                  </p>
                </Card>
              )}
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <RadioGroupItem value="B" id="responsibility-b" className="mt-1" />
            <div>
              <Label htmlFor="responsibility-b" className="font-medium text-gray-900 text-sm">
                Conducătorul Vehiculului <span className="font-semibold">B</span> <span className="font-semibold">(Celălalt șofer)</span>
              </Label>
              {responsibility === "B" && (
                <Card className="p-3 mt-1 bg-blue-sky-50 border-blue-sky-200" style={{ backgroundColor: '#D6E5F8' }}>
                  <p className="text-xs sm:text-sm text-blue-sky-800">
                    <span className="font-medium">{driverBName}</span> recunoaște că este responsabil pentru producerea
                    acestui accident.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Note / Observații</h3>
        <p className="text-sm text-gray-700">
          Adăugați orice alte detalii sau observații relevante despre accident (opțional).
        </p>

        <Textarea
          {...register("notes")}
          placeholder="Introduceți observații suplimentare aici..."
          className="min-h-[120px] border-gray-300"
        />
      </div>
    </div>
  )
}
