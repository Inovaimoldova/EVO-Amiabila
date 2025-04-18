"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Download, Loader2, Mail, CheckCheck, UploadCloud } from "lucide-react"
import { useFormContext } from "react-hook-form"
import type { AccidentFormData } from "@/lib/types"
import { useState, useEffect } from "react"

interface SignatureCompletionStepProps {
  isSubmitting: boolean
  isCompleted: boolean
  onSubmit: () => void
}

export default function SignatureCompletionStep({ isSubmitting, isCompleted, onSubmit }: SignatureCompletionStepProps) {
  const { setValue, getValues } = useFormContext<AccidentFormData>()
  const [isSigningA, setIsSigningA] = useState(false)
  const [isSigningB, setIsSigningB] = useState(false)
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null)
  const [showJson, setShowJson] = useState(false)
  const [jsonData, setJsonData] = useState("")

  const signatureA = getValues("signatures.partyA")
  const signatureB = getValues("signatures.partyB")
  const driverAName = `${getValues("driverA.firstName")} ${getValues("driverA.lastName")}`

  const handleSimulateSendToEvo = () => {
    const formData = getValues()
    const jsonString = JSON.stringify(formData, null, 2)
    setJsonData(jsonString)
    setShowJson(true)
  }

  const handleSignA = () => {
    setIsSigningA(true)
    // Simulate EVO Sign process
    setTimeout(() => {
      setValue("signatures.partyA", "SIGNED_VIA_EVO")
      setIsSigningA(false)
    }, 1500)
  }

  const handleSignB = () => {
    setIsSigningB(true)
    // Simulate EVO Sign process
    setTimeout(() => {
      setValue("signatures.partyB", "SIGNED_VIA_EVO")
      setIsSigningB(false)
    }, 1500)
  }

  useEffect(() => {
    if (isCompleted && !referenceNumber) {
      const newRefNumber = `CAA-${Math.floor(Math.random() * 1000000)}`
      setReferenceNumber(newRefNumber)
    }
  }, [isCompleted, referenceNumber])

  if (isCompleted) {
    if (!referenceNumber) {
      return null;
    }

    if (showJson) {
      return (
        <div className="space-y-4 p-4 rounded-lg" style={{ backgroundColor: '#E8F1F1' }}>
          <h3 className="text-lg font-medium text-gray-900">Date Simulate Trimise către EVO (JSON)</h3>
          <Card className="p-4 border-gray-200 shadow-sm max-h-[500px] overflow-auto bg-white">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap break-words">
              {jsonData}
            </pre>
          </Card>
          <Button variant="outline" onClick={() => setShowJson(false)}>
            Înapoi la Sumar
          </Button>
        </div>
      )
    }

    return (
      <div className="space-y-6 text-center p-4 rounded-lg" style={{ backgroundColor: '#E8F1F1' }}>
        <CheckCircle2 className="h-12 w-12 sm:h-16 sm:w-16 text-green-600 mx-auto" />

        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-medium text-gray-900">
            Constatarea amiabilă a fost trimisă cu succes!
          </h3>
          <p className="text-gray-700">
            Număr de referință: <span className="font-medium">CAA-{referenceNumber}</span>
          </p>
          <p className="text-gray-700 max-w-md mx-auto text-sm sm:text-base">
            O copie a constatării a fost trimisă pe email-ul dvs. și poate fi accesată oricând în istoricul
            constatărilor.
          </p>
        </div>

        <div className="flex flex-col gap-3 items-center mt-6 w-full max-w-xs mx-auto">
          <a href="/constatare-amiabila.pdf" download={`Constatare-${referenceNumber}.pdf`} className="w-full">
            <Button
              className="flex items-center justify-center gap-2 bg-blue-sky-600 hover:bg-blue-sky-700 text-white w-full"
            >
              <Download className="h-4 w-4" />
              <span>Descarcă PDF</span>
            </Button>
          </a>
          <Button variant="outline" className="flex items-center justify-center gap-2 text-gray-700 border-gray-300 w-full">
            <Mail className="h-4 w-4" />
            <span>Retrimite pe Email</span>
          </Button>
          <Button
            variant="secondary"
            onClick={handleSimulateSendToEvo}
            className="flex items-center justify-center gap-2 w-full"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Trimite la EVO (Simulare)</span>
          </Button>
        </div>

        <Button variant="link" className="mt-4 text-blue-sky-600" onClick={() => window.location.reload()}>
          Închide și Revino la Pagina Principală
        </Button>
      </div>
    )
  }

  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-12 p-4 rounded-lg" style={{ backgroundColor: '#FEF5DD' }}>
        <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-blue-sky-600 animate-spin mb-4" />
        <h3 className="text-base sm:text-lg font-medium text-gray-900">Se finalizează constatarea...</h3>
        <p className="text-gray-700 mt-2 text-sm sm:text-base">
          Vă rugăm să așteptați, procesăm datele și generăm documentul.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8 p-4 rounded-lg" style={{ backgroundColor: '#E8F0FB' }}>
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Semnături Digitale</h3>
        <p className="text-gray-700 text-sm sm:text-base">
          Pentru finalizarea constatării amiabile, ambii șoferi trebuie să semneze digital folosind EVO Sign.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-3 sm:p-4 shadow-sm border-gray-200" style={{ backgroundColor: '#D6E5F8' }}>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-900">Semnătură Șofer A</h4>
            </div>

            <p className="text-sm text-gray-600">{driverAName || "Șoferul A"}</p>

            {isSigningA && (
              <div className="flex items-center justify-center gap-2 text-blue-sky-600 py-4">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Procesare semnătură EVO Sign...</span>
              </div>
            )}

            {signatureA ? (
              <div className="border rounded-lg p-2" style={{ backgroundColor: '#EBF7F1' }}>
                <div className="flex items-center justify-center py-6 gap-2">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <span className="text-green-600 font-medium">Semnat digital via EVO Sign</span>
                </div>
              </div>
            ) : (
              !isSigningA && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-24 flex items-center justify-center">
                  <p className="text-sm text-gray-400">Semnătura va apărea aici</p>
                </div>
              )
            )}

            {!signatureA && !isSigningA && (
              <div className="flex flex-col items-center justify-center mt-2 space-y-1">
                <span className="text-sm font-medium text-gray-700">Semnează Digital (EVO Sign)</span>
                <button
                  type="button"
                  onClick={handleSignA}
                  className="border border-gray-300 rounded-md p-1 hover:border-blue-sky-500 focus:outline-none focus:ring-2 focus:ring-blue-sky-500 focus:ring-offset-2 transition-all"
                  aria-label="Semnează Digital pentru Șofer A"
                  style={{ backgroundColor: 'white' }}
                >
                  <img src="/msign.png" alt="Sign Button" className="h-16 w-32 object-contain" />
                </button>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-3 sm:p-4 shadow-sm border-gray-200" style={{ backgroundColor: '#D6E5F8' }}>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-900">Semnătură Șofer B</h4>
            </div>

            <p className="text-sm text-gray-600">Șoferul B</p>

            {isSigningB && (
              <div className="flex items-center justify-center gap-2 text-blue-sky-600 py-4">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Procesare semnătură EVO Sign...</span>
              </div>
            )}

            {signatureB ? (
              <div className="border rounded-lg p-2" style={{ backgroundColor: '#EBF7F1' }}>
                <div className="flex items-center justify-center py-6 gap-2">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <span className="text-green-600 font-medium">Semnat digital via EVO Sign</span>
                </div>
              </div>
            ) : (
              !isSigningB && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-24 flex items-center justify-center">
                  <p className="text-sm text-gray-400">Semnătura va apărea aici</p>
                </div>
              )
            )}

            {!signatureB && !isSigningB && (
               <div className="flex flex-col items-center justify-center mt-2 space-y-1">
                 <span className="text-sm font-medium text-gray-700">Semnează Digital (EVO Sign)</span>
                 <button
                   type="button"
                   onClick={handleSignB}
                   className="border border-gray-300 rounded-md p-1 hover:border-blue-sky-500 focus:outline-none focus:ring-2 focus:ring-blue-sky-500 focus:ring-offset-2 transition-all"
                   aria-label="Semnează Digital pentru Șofer B"
                   style={{ backgroundColor: 'white' }}
                 >
                   <img src="/msign.png" alt="Sign Button" className="h-16 w-32 object-contain" />
                 </button>
               </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-3 sm:p-4 bg-blue-sky-50 border-blue-sky-200 mt-4 sm:mt-6">
        <p className="text-sm text-blue-sky-800">
          <span className="font-medium">Important:</span> Prin semnarea acestei constatări amiabile, confirmați că
          informațiile furnizate sunt corecte și complete. Documentul semnat va fi transmis companiilor de asigurări
          pentru procesare.
        </p>
      </Card>

      <div className="flex justify-end mt-4 sm:mt-6">
        <Button
          onClick={onSubmit}
          disabled={!signatureA || !signatureB}
          className="flex items-center gap-2 bg-blue-sky-600 hover:bg-blue-sky-700 text-white"
        >
          <CheckCheck className="h-4 w-4" />
          Trimite Constatarea
        </Button>
      </div>
    </div>
  )
}
