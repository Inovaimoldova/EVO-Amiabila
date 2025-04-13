"use client"

import { useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ConditionsStep from "./steps/conditions-step"
import CollaborativeStep from "./steps/collaborative-step"
import DateLocationStep from "./steps/date-location-step"
import WitnessesStep from "./steps/witnesses-step"
import CircumstancesStep from "./steps/circumstances-step"
import PartyADataStep from "./steps/party-a-data-step"
import SketchStep from "./steps/sketch-step"
import DamageDetailsStep from "./steps/damage-details-step"
import ResponsibilityNotesStep from "./steps/responsibility-notes-step"
import ReviewStep from "./steps/review-step"
import SignatureCompletionStep from "./steps/signature-completion-step"
import { FormProvider, useForm } from "react-hook-form"
import type { AccidentFormData } from "@/lib/types"

const STEPS = [
  "Condiții Prealabile",
  "Sesiune Colaborativă",
  "Data, Ora și Locația",
  "Martori",
  "Circumstanțe",
  "Datele Mele (Partea A)",
  "Schița Accidentului",
  "Detalii Avarii",
  "Responsabilitate și Observații",
  "Verificare",
  "Semnături și Finalizare",
]

export default function AccidentReportForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPartyBConfirmed, setIsPartyBConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const methods = useForm<AccidentFormData>({
    defaultValues: {
      conditions: {
        confirmed: false,
      },
      dateTime: {
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().slice(0, 5),
      },
      location: {
        city: "",
        street: "",
        number: "",
      },
      witnesses: {
        hasWitnesses: undefined,
        list: [],
      },
      circumstances: {
        vehicleAStatus: undefined,
        vehicleAAction: undefined,
        vehicleBStatus: undefined,
        vehicleBAction: undefined,
        roadConditions: [],
      },
      vehicleA: {
        make: "",
        model: "",
        plateNumber: "",
        vin: "",
        hasTrailer: false,
        trailerPlate: "",
        trailerVin: "",
        insurance: {
          company: "",
          policyNumber: "",
          validFrom: "",
          validTo: "",
          insuredName: "",
          insuredAddress: "",
        },
      },
      driverA: {
        firstName: "",
        lastName: "",
        idnp: "",
        address: "",
        phone: "",
        license: {
          number: "",
          categories: "",
          issueDate: "",
          expiryDate: "",
        },
      },
      vehicleB: {
        make: "",
        model: "",
        plateNumber: "",
        vin: "",
        hasTrailer: false,
        trailerPlate: "",
        trailerVin: "",
        insurance: {
          company: "",
          policyNumber: "",
          validFrom: "",
          validTo: "",
          insuredName: "",
          insuredAddress: "",
        },
      },
      driverB: {
        firstName: "",
        lastName: "",
        idnp: "",
        address: "",
        phone: "",
        license: {
          number: "",
          categories: "",
          issueDate: "",
          expiryDate: "",
        },
      },
      sketch: null,
      impactPoints: {
        vehicleA: null,
        vehicleB: null,
      },
      damages: {
        vehicleA: {
          photos: [],
          description: "",
          areas: [],
        },
        vehicleB: {
          photos: [],
          description: "",
          areas: [],
        },
      },
      responsibility: {
        party: undefined,
      },
      notes: "",
      signatures: {
        partyA: null,
        partyB: null,
      },
    },
  })

  const progress = ((currentStep + 1) / STEPS.length) * 100

  const handleNext = () => {
    if (currentStep === STEPS.length - 1) {
      handleSubmit()
      return
    }
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1))
    window.scrollTo(0, 0)
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
    window.scrollTo(0, 0)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setIsCompleted(true)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <ConditionsStep onConfirm={handleNext} />
      case 1:
        return (
          <CollaborativeStep isPartyBConfirmed={isPartyBConfirmed} onPartyBConfirm={() => setIsPartyBConfirmed(true)} />
        )
      case 2:
        return <DateLocationStep />
      case 3:
        return <WitnessesStep />
      case 4:
        return <CircumstancesStep />
      case 5:
        return <PartyADataStep />
      case 6:
        return (
          <SketchStep
            data={methods.getValues("sketch")}
            updateData={(data) => {
              methods.setValue("sketch", data)
            }}
            onContinue={handleNext}
            onBack={handleBack}
          />
        )
      case 7:
        return <DamageDetailsStep />
      case 8:
        return <ResponsibilityNotesStep />
      case 9:
        return <ReviewStep />
      case 10:
        return <SignatureCompletionStep isSubmitting={isSubmitting} isCompleted={isCompleted} onSubmit={handleSubmit} />
      default:
        return null
    }
  }

  const canProceed = () => {
    if (currentStep === 0) return methods.getValues("conditions.confirmed")
    if (currentStep === 1) return isPartyBConfirmed
    if (currentStep === 8) return methods.getValues("responsibility.party") !== undefined
    if (currentStep === 10)
      return methods.getValues("signatures.partyA") !== null && methods.getValues("signatures.partyB") !== null
    return true
  }

  return (
    <FormProvider {...methods}>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">{STEPS[currentStep]}</h2>
            <span className="text-xs sm:text-sm text-gray-500">
              Pasul {currentStep + 1} din {STEPS.length}
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-100" indicatorClassName="bg-blue-sky-600" />
        </div>

        <div className="p-3 sm:p-6">{renderStep()}</div>

        {currentStep > 0 && currentStep < STEPS.length && (
          <div className="p-3 sm:p-4 border-t border-gray-200 flex justify-between">
            <Button variant="outline" onClick={handleBack} className="flex items-center gap-1 text-gray-700">
              <ChevronLeft className="h-4 w-4" />
              Înapoi
            </Button>
            {currentStep < STEPS.length - 1 && (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-1 bg-blue-sky-600 hover:bg-blue-sky-700 text-white"
              >
                Continuă
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </FormProvider>
  )
}
