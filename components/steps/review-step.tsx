"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { useFormContext } from "react-hook-form"
import type { AccidentFormData } from "@/lib/types"

export default function ReviewStep() {
  const { getValues } = useFormContext<AccidentFormData>()

  return (
    <div className="space-y-6">
      <Card className="p-3 sm:p-4 bg-apricot-50 border-apricot-200">
        <div className="flex gap-2 sm:gap-3">
          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-apricot-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-apricot-800 text-sm">Important</h4>
            <p className="text-apricot-700 text-xs sm:text-sm mt-1">
              Verificați cu atenție toate informațiile înainte de a semna. După semnare, constatarea amiabilă nu mai
              poate fi modificată.
            </p>
          </div>
        </div>
      </Card>

      <Accordion type="multiple" className="w-full mt-4">
        <AccordionItem value="date-time-location" className="border-gray-200">
          <AccordionTrigger className="text-sm py-3 text-gray-900 hover:text-gray-900 hover:no-underline">
            Data, Ora și Locația
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Data:</span>
                <span>{getValues("dateTime.date")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ora:</span>
                <span>{getValues("dateTime.time")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Localitate:</span>
                <span>{getValues("location.city")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Stradă:</span>
                <span>{getValues("location.street")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Nr./Bornă:</span>
                <span>{getValues("location.number")}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="witnesses" className="border-gray-200">
          <AccordionTrigger className="text-sm py-3 text-gray-900 hover:text-gray-900 hover:no-underline">
            Martori
          </AccordionTrigger>
          <AccordionContent>
            {getValues("witnesses.hasWitnesses") ? (
              <div className="space-y-4">
                {getValues("witnesses.list").map((witness, index) => (
                  <div key={witness.id} className="text-sm space-y-1">
                    <p className="font-medium">Martor {index + 1}</p>
                    <p>
                      Nume: {witness.firstName} {witness.lastName}
                    </p>
                    <p>Adresă: {witness.address}</p>
                    <p>Telefon: {witness.phone}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm">Nu există martori declarați.</p>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="circumstances" className="border-gray-200">
          <AccordionTrigger className="text-sm py-3 text-gray-900 hover:text-gray-900 hover:no-underline">
            Circumstanțe
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium">Vehicul A:</p>
                <p>
                  {getValues("circumstances.vehicleAStatus") === "stationary"
                    ? "Era staționar/oprit"
                    : "Era în mișcare"}
                  {getValues("circumstances.vehicleAAction") && ` - ${getValues("circumstances.vehicleAAction")}`}
                </p>
              </div>

              <div>
                <p className="font-medium">Vehicul B:</p>
                <p>
                  {getValues("circumstances.vehicleBStatus") === "stationary"
                    ? "Era staționar/oprit"
                    : "Era în mișcare"}
                  {getValues("circumstances.vehicleBAction") && ` - ${getValues("circumstances.vehicleBAction")}`}
                </p>
              </div>

              <div>
                <p className="font-medium">Condiții de drum:</p>
                <p>
                  {getValues("circumstances.roadConditions").length > 0
                    ? getValues("circumstances.roadConditions").join(", ")
                    : "Nu au fost specificate"}
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="vehicle-a" className="border-gray-200">
          <AccordionTrigger className="text-sm py-3 text-gray-900 hover:text-gray-900 hover:no-underline">
            Vehicul A
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium">Date vehicul:</p>
                <p>Marcă: {getValues("vehicleA.make")}</p>
                <p>Model: {getValues("vehicleA.model")}</p>
                <p>Nr. înmatriculare: {getValues("vehicleA.plateNumber")}</p>
                <p>VIN: {getValues("vehicleA.vin")}</p>
                {getValues("vehicleA.hasTrailer") && (
                  <>
                    <p className="mt-2 font-medium">Remorcă:</p>
                    <p>Nr. înmatriculare: {getValues("vehicleA.trailerPlate")}</p>
                    <p>VIN: {getValues("vehicleA.trailerVin")}</p>
                  </>
                )}
              </div>

              <div>
                <p className="font-medium">Asigurare:</p>
                <p>Asigurător: {getValues("vehicleA.insurance.company")}</p>
                <p>Poliță Nr.: {getValues("vehicleA.insurance.policyNumber")}</p>
                <p>Valabilă de la: {getValues("vehicleA.insurance.validFrom")}</p>
                <p>Valabilă până la: {getValues("vehicleA.insurance.validTo")}</p>
                <p>Asigurat: {getValues("vehicleA.insurance.insuredName")}</p>
                <p>Adresă: {getValues("vehicleA.insurance.insuredAddress")}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="driver-a" className="border-gray-200">
          <AccordionTrigger className="text-sm py-3 text-gray-900 hover:text-gray-900 hover:no-underline">
            Șofer A
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 text-sm">
              <div>
                <p>
                  Nume: {getValues("driverA.firstName")} {getValues("driverA.lastName")}
                </p>
                <p>IDNP: {getValues("driverA.idnp")}</p>
                <p>Adresă: {getValues("driverA.address")}</p>
                <p>Telefon: {getValues("driverA.phone")}</p>
              </div>

              <div>
                <p className="font-medium">Permis de conducere:</p>
                <p>Număr: {getValues("driverA.license.number")}</p>
                <p>Categorii: {getValues("driverA.license.categories")}</p>
                <p>Data emiterii: {getValues("driverA.license.issueDate")}</p>
                <p>Data expirării: {getValues("driverA.license.expiryDate")}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="vehicle-b" className="border-gray-200">
          <AccordionTrigger className="text-sm py-3 text-gray-900 hover:text-gray-900 hover:no-underline">
            Vehicul B
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium">Date vehicul:</p>
                <p>Marcă: {getValues("vehicleB.make")}</p>
                <p>Model: {getValues("vehicleB.model")}</p>
                <p>Nr. înmatriculare: {getValues("vehicleB.plateNumber")}</p>
                <p>VIN: {getValues("vehicleB.vin")}</p>
                {getValues("vehicleB.hasTrailer") && (
                  <>
                    <p className="mt-2 font-medium">Remorcă:</p>
                    <p>Nr. înmatriculare: {getValues("vehicleB.trailerPlate")}</p>
                    <p>VIN: {getValues("vehicleB.trailerVin")}</p>
                  </>
                )}
              </div>

              <div>
                <p className="font-medium">Asigurare:</p>
                <p>Asigurător: {getValues("vehicleB.insurance.company")}</p>
                <p>Poliță Nr.: {getValues("vehicleB.insurance.policyNumber")}</p>
                <p>Valabilă de la: {getValues("vehicleB.insurance.validFrom")}</p>
                <p>Valabilă până la: {getValues("vehicleB.insurance.validTo")}</p>
                <p>Asigurat: {getValues("vehicleB.insurance.insuredName")}</p>
                <p>Adresă: {getValues("vehicleB.insurance.insuredAddress")}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="driver-b" className="border-gray-200">
          <AccordionTrigger className="text-sm py-3 text-gray-900 hover:text-gray-900 hover:no-underline">
            Șofer B
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 text-sm">
              <div>
                <p>
                  Nume: {getValues("driverB.firstName")} {getValues("driverB.lastName")}
                </p>
                <p>IDNP: {getValues("driverB.idnp")}</p>
                <p>Adresă: {getValues("driverB.address")}</p>
                <p>Telefon: {getValues("driverB.phone")}</p>
              </div>

              <div>
                <p className="font-medium">Permis de conducere:</p>
                <p>Număr: {getValues("driverB.license.number")}</p>
                <p>Categorii: {getValues("driverB.license.categories")}</p>
                <p>Data emiterii: {getValues("driverB.license.issueDate")}</p>
                <p>Data expirării: {getValues("driverB.license.expiryDate")}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="impact-points" className="border-gray-200">
          <AccordionTrigger className="text-sm py-3 text-gray-900 hover:text-gray-900 hover:no-underline">
            Puncte de Impact
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium">Vehicul A:</p>
                <p>{getValues("impactPoints.vehicleA") || "Nu a fost selectat"}</p>
              </div>
              <div>
                <p className="font-medium">Vehicul B:</p>
                <p>{getValues("impactPoints.vehicleB") || "Nu a fost selectat"}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="damages" className="border-gray-200">
          <AccordionTrigger className="text-sm py-3 text-gray-900 hover:text-gray-900 hover:no-underline">
            Avarii
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium">Avarii Vehicul A:</p>
                <p>{getValues("damages.vehicleA.description") || "Nu au fost descrise"}</p>
                <p className="mt-1">
                  Zone afectate:{" "}
                  {getValues("damages.vehicleA.areas").length > 0
                    ? getValues("damages.vehicleA.areas").join(", ")
                    : "Nu au fost selectate"}
                </p>
              </div>
              <div className="mt-4">
                <p className="font-medium">Avarii Vehicul B:</p>
                <p>{getValues("damages.vehicleB.description") || "Nu au fost descrise"}</p>
                <p className="mt-1">
                  Zone afectate:{" "}
                  {getValues("damages.vehicleB.areas").length > 0
                    ? getValues("damages.vehicleB.areas").join(", ")
                    : "Nu au fost selectate"}
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="responsibility" className="border-gray-200">
          <AccordionTrigger className="text-sm py-3 text-gray-900 hover:text-gray-900 hover:no-underline">
            Responsabilitate
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm">
              {getValues("responsibility.party") === "A"
                ? `Conducătorul Vehiculului A (${getValues("driverA.firstName")} ${getValues("driverA.lastName")}) își recunoaște responsabilitatea.`
                : getValues("responsibility.party") === "B"
                  ? "Conducătorul Vehiculului B își recunoaște responsabilitatea."
                  : "Nu a fost declarată responsabilitatea."}
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="notes" className="border-gray-200">
          <AccordionTrigger className="text-sm py-3 text-gray-900 hover:text-gray-900 hover:no-underline">
            Observații
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm">{getValues("notes") || "Nu au fost adăugate observații."}</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sketch" className="border-gray-200">
          <AccordionTrigger className="text-sm py-3 text-gray-900 hover:text-gray-900 hover:no-underline">
            Schiță
          </AccordionTrigger>
          <AccordionContent>
            {getValues("sketch") ? (
              <img
                src={getValues("sketch") || "/placeholder.svg"}
                alt="Schița accidentului"
                className="max-w-full border rounded-lg"
              />
            ) : (
              <p className="text-sm">Nu a fost creată o schiță.</p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
