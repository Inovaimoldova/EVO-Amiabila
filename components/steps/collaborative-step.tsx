"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Loader2, QrCode, Smartphone } from "lucide-react"
import { useState } from "react"

interface CollaborativeStepProps {
  isPartyBConfirmed: boolean
  onPartyBConfirm: () => void
}

export default function CollaborativeStep({ isPartyBConfirmed, onPartyBConfirm }: CollaborativeStepProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePartyBConfirm = () => {
    setIsLoading(true)
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
      onPartyBConfirm()
    }, 1500)
  }

  return (
    <div className="space-y-6 p-4 rounded-lg" style={{ backgroundColor: '#E8F0FB' }}>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Sesiune Colaborativă</h3>
        <p className="text-gray-600">
          Pentru a completa constatarea amiabilă digital, ambii șoferi trebuie să confirme participarea.
        </p>
      </div>

      <Card className="p-3 sm:p-4 bg-green-50 border-green-200">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
          <p className="text-green-800 font-medium">Șoferul A (Dvs.) a confirmat condițiile.</p>
        </div>
      </Card>

      <div className="border rounded-lg p-6 space-y-6">
        <h4 className="font-medium text-center">Șoferul B trebuie să confirme participarea</h4>

        <div className="flex flex-col items-center justify-center gap-4">
          <div className="bg-gray-100 p-4 sm:p-6 rounded-lg mx-auto max-w-[200px]">
            <QrCode className="h-28 w-28 sm:h-32 sm:w-32 text-gray-800 mx-auto" />
          </div>
          <p className="text-sm text-center text-gray-600 max-w-xs">
            Rugați Șoferul B să scaneze acest cod QR cu telefonul pentru a se alătura sesiunii.
          </p>
        </div>

        <div className="text-center">
          <p className="text-lg font-bold text-gray-600 mb-2">sau</p>
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handlePartyBConfirm}
              disabled={isLoading || isPartyBConfirmed}
              className="flex items-center gap-2 text-gray-700"
            >
              <Smartphone className="h-4 w-4" />
              Confirmă Aici
            </Button>
          </div>
        </div>

        {!isPartyBConfirmed && !isLoading && (
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Așteptând confirmarea Șoferului B...</span>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-blue-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Se procesează confirmarea...</span>
          </div>
        )}

        {isPartyBConfirmed && (
          <Card className="p-3 sm:p-4 bg-green-50 border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="text-green-800 font-medium">Ambii șoferi au confirmat participarea.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
