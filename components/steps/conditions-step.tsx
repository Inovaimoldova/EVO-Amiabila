"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, AlertTriangle } from "lucide-react"
import { useFormContext } from "react-hook-form"
import type { AccidentFormData } from "@/lib/types"

const CONDITIONS = [
  "Accidentul implică doar două vehicule",
  "Nu există răniți sau victime",
  "Ambele vehicule sunt în stare de funcționare",
  "Daunele materiale nu depășesc 15000 de lei",
  "Ambii șoferi sunt prezenți la locul accidentului",
  "Ambii șoferi sunt de acord să completeze constatarea amiabilă",
]

interface ConditionsStepProps {
  onConfirm: () => void
}

export default function ConditionsStep({ onConfirm }: ConditionsStepProps) {
  const { setValue, getValues } = useFormContext<AccidentFormData>()

  const handleConfirm = () => {
    setValue("conditions.confirmed", true)
    onConfirm()
  }

  return (
    <div className="space-y-6 p-4 rounded-lg" style={{ backgroundColor: '#E8F0FB' }}>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Condiții de Utilizare</h3>
        <p className="text-sm text-gray-600">
          Citiți cu atenție condițiile înainte de a continua. Completarea constatării amiabile digital necesită acordul
          ambelor părți implicate în accident.
        </p>
        <ul className="space-y-3">
          {CONDITIONS.map((condition, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="font-semibold">{condition}</span>
            </li>
          ))}
        </ul>
      </div>

      <Card className="bg-apricot-50 border-apricot-200 p-3 sm:p-4">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-apricot-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-apricot-800">Notă importantă</h4>
            <p className="text-apricot-700 text-sm mt-1">
              Dacă oricare dintre condițiile de mai sus nu este îndeplinită, contactați Poliția la numărul 112 pentru a
              raporta accidentul. Constatarea amiabilă nu poate fi utilizată în acest caz.
            </p>
          </div>
        </div>
      </Card>

      <Button
        onClick={handleConfirm}
        className="w-full mt-6 bg-blue-sky-600 hover:bg-blue-sky-700 text-white"
        size="lg"
      >
        Continuă
      </Button>
    </div>
  )
}
