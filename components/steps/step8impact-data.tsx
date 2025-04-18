"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button" // Assuming these paths are correct
import { Card, CardContent } from "@/components/ui/card" // Assuming these paths are correct

interface ImpactPointsData {
  vehicleA: string | null
  vehicleB: string | null
}

interface ImpactPointStepProps {
  data: ImpactPointsData
  updateData: (data: ImpactPointsData) => void
  onContinue: () => void
  onBack: () => void
}

// Define vehicle areas with their labels and SVG properties (optional refinement)
// We keep the original array for simplicity in this version, mapping IDs to SVG elements
const vehicleAreas = [
  { id: "front-bumper", label: "Bară Față" },
  { id: "hood", label: "Capotă" },
  { id: "windshield", label: "Parbriz" },
  { id: "roof", label: "Plafon" },
  { id: "rear-window", label: "Lunetă" },
  { id: "trunk", label: "Portbagaj" },
  { id: "rear-bumper", label: "Bară Spate" },
  { id: "front-right-fender", label: "Aripă Dreapta Față" },
  { id: "front-right-door", label: "Ușă Dreapta Față" },
  { id: "rear-right-door", label: "Ușă Dreapta Spate" },
  { id: "rear-right-fender", label: "Aripă Dreapta Spate" },
  { id: "front-left-fender", label: "Aripă Stânga Față" },
  { id: "front-left-door", label: "Ușă Stânga Față" },
  { id: "rear-left-door", label: "Ușă Stânga Spate" },
  { id: "rear-left-fender", label: "Aripă Stânga Spate" },
  // You could add non-clickable parts like wheels here if needed
]

const getAreaLabel = (areaId: string | null) => {
  if (!areaId) return null
  const area = vehicleAreas.find((a) => a.id === areaId)
  return area ? area.label : null
}

export default function ImpactPointStep({ data, updateData, onContinue, onBack }: ImpactPointStepProps) {
  const [impactPoints, setImpactPoints] = useState<ImpactPointsData>(data || { vehicleA: null, vehicleB: null })

  const handleVehicleAClick = (area: string) => {
    setImpactPoints((prev) => ({ ...prev, vehicleA: area === prev.vehicleA ? null : area })) // Allow deselecting
  }

  const handleVehicleBClick = (area: string) => {
    setImpactPoints((prev) => ({ ...prev, vehicleB: area === prev.vehicleB ? null : area })) // Allow deselecting
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateData(impactPoints)
    onContinue()
  }

  // Reusable SVG Car Component
  const SvgCar = ({ selectedPoint, handleClick }: { selectedPoint: string | null, handleClick: (area: string) => void }) => (
    <svg viewBox="0 0 200 340" className="absolute inset-0 w-full h-full p-2 sm:p-4"> {/* Adjusted viewBox */}
      {/* Apply common styles to group */}
      <g stroke="#4a5568" strokeWidth="0.8" fill="#f7fafc">

        {/* --- Central Body --- */}
        {/* Front Bumper - Curved Path */}
        <path
          d="M 60 20 Q 100 5 140 20 L 145 40 L 55 40 Z"
          fill={selectedPoint === "front-bumper" ? "#fed7d7" : "#e2e8f0"}
          stroke={selectedPoint === "front-bumper" ? "#e53e3e" : "#4a5568"}
          strokeWidth={selectedPoint === "front-bumper" ? "1.5" : "0.8"}
          onClick={() => handleClick("front-bumper")} style={{ cursor: "pointer" }}
          className="car-part hover:opacity-80 transition-opacity"
        />
        {/* Hood */}
        <rect x="55" y="40" width="90" height="50" rx="3"
          fill={selectedPoint === "hood" ? "#fed7d7" : "#f7fafc"}
          stroke={selectedPoint === "hood" ? "#e53e3e" : "#4a5568"}
          strokeWidth={selectedPoint === "hood" ? "1.5" : "0.8"}
          onClick={() => handleClick("hood")} style={{ cursor: "pointer" }}
          className="car-part hover:opacity-80 transition-opacity"
        />
        {/* Windshield */}
        <rect x="60" y="90" width="80" height="35" rx="5"
          fill={selectedPoint === "windshield" ? "#fed7d7" : "#ebf8ff"} // Light blue for glass
          stroke={selectedPoint === "windshield" ? "#e53e3e" : "#4a5568"}
          strokeWidth={selectedPoint === "windshield" ? "1.5" : "0.8"}
          onClick={() => handleClick("windshield")} style={{ cursor: "pointer" }}
          className="car-part hover:opacity-80 transition-opacity"
        />
        {/* Roof */}
        <rect x="55" y="125" width="90" height="90" rx="5"
          fill={selectedPoint === "roof" ? "#fed7d7" : "#f7fafc"}
          stroke={selectedPoint === "roof" ? "#e53e3e" : "#4a5568"}
          strokeWidth={selectedPoint === "roof" ? "1.5" : "0.8"}
          onClick={() => handleClick("roof")} style={{ cursor: "pointer" }}
          className="car-part hover:opacity-80 transition-opacity"
        />
        {/* Rear Window */}
        <rect x="60" y="215" width="80" height="35" rx="5"
          fill={selectedPoint === "rear-window" ? "#fed7d7" : "#ebf8ff"} // Light blue for glass
          stroke={selectedPoint === "rear-window" ? "#e53e3e" : "#4a5568"}
          strokeWidth={selectedPoint === "rear-window" ? "1.5" : "0.8"}
          onClick={() => handleClick("rear-window")} style={{ cursor: "pointer" }}
          className="car-part hover:opacity-80 transition-opacity"
        />
        {/* Trunk */}
        <rect x="55" y="250" width="90" height="50" rx="3"
          fill={selectedPoint === "trunk" ? "#fed7d7" : "#f7fafc"}
          stroke={selectedPoint === "trunk" ? "#e53e3e" : "#4a5568"}
          strokeWidth={selectedPoint === "trunk" ? "1.5" : "0.8"}
          onClick={() => handleClick("trunk")} style={{ cursor: "pointer" }}
          className="car-part hover:opacity-80 transition-opacity"
        />
        {/* Rear Bumper - Curved Path */}
        <path
          d="M 55 300 L 145 300 Q 100 325 55 300 Z"
           fill={selectedPoint === "rear-bumper" ? "#fed7d7" : "#e2e8f0"}
           stroke={selectedPoint === "rear-bumper" ? "#e53e3e" : "#4a5568"}
           strokeWidth={selectedPoint === "rear-bumper" ? "1.5" : "0.8"}
           onClick={() => handleClick("rear-bumper")} style={{ cursor: "pointer" }}
           className="car-part hover:opacity-80 transition-opacity"
        />

        {/* --- Left Side --- */}
        {/* Front Left Fender */}
        <rect x="30" y="40" width="25" height="50" rx="5"
          fill={selectedPoint === "front-left-fender" ? "#fed7d7" : "#f7fafc"}
          stroke={selectedPoint === "front-left-fender" ? "#e53e3e" : "#4a5568"}
          strokeWidth={selectedPoint === "front-left-fender" ? "1.5" : "0.8"}
          onClick={() => handleClick("front-left-fender")} style={{ cursor: "pointer" }}
          className="car-part hover:opacity-80 transition-opacity"
        />
        {/* Front Left Door */}
        <rect x="30" y="125" width="25" height="45" rx="3"
          fill={selectedPoint === "front-left-door" ? "#fed7d7" : "#f7fafc"}
          stroke={selectedPoint === "front-left-door" ? "#e53e3e" : "#4a5568"}
          strokeWidth={selectedPoint === "front-left-door" ? "1.5" : "0.8"}
          onClick={() => handleClick("front-left-door")} style={{ cursor: "pointer" }}
          className="car-part hover:opacity-80 transition-opacity"
        />
        {/* Rear Left Door */}
        <rect x="30" y="170" width="25" height="45" rx="3"
          fill={selectedPoint === "rear-left-door" ? "#fed7d7" : "#f7fafc"}
          stroke={selectedPoint === "rear-left-door" ? "#e53e3e" : "#4a5568"}
          strokeWidth={selectedPoint === "rear-left-door" ? "1.5" : "0.8"}
          onClick={() => handleClick("rear-left-door")} style={{ cursor: "pointer" }}
          className="car-part hover:opacity-80 transition-opacity"
        />
        {/* Rear Left Fender */}
        <rect x="30" y="250" width="25" height="50" rx="5"
          fill={selectedPoint === "rear-left-fender" ? "#fed7d7" : "#f7fafc"}
          stroke={selectedPoint === "rear-left-fender" ? "#e53e3e" : "#4a5568"}
          strokeWidth={selectedPoint === "rear-left-fender" ? "1.5" : "0.8"}
          onClick={() => handleClick("rear-left-fender")} style={{ cursor: "pointer" }}
          className="car-part hover:opacity-80 transition-opacity"
        />

        {/* --- Right Side --- */}
        {/* Front Right Fender */}
        <rect x="145" y="40" width="25" height="50" rx="5"
          fill={selectedPoint === "front-right-fender" ? "#fed7d7" : "#f7fafc"}
          stroke={selectedPoint === "front-right-fender" ? "#e53e3e" : "#4a5568"}
          strokeWidth={selectedPoint === "front-right-fender" ? "1.5" : "0.8"}
          onClick={() => handleClick("front-right-fender")} style={{ cursor: "pointer" }}
          className="car-part hover:opacity-80 transition-opacity"
        />
        {/* Front Right Door */}
        <rect x="145" y="125" width="25" height="45" rx="3"
          fill={selectedPoint === "front-right-door" ? "#fed7d7" : "#f7fafc"}
          stroke={selectedPoint === "front-right-door" ? "#e53e3e" : "#4a5568"}
          strokeWidth={selectedPoint === "front-right-door" ? "1.5" : "0.8"}
          onClick={() => handleClick("front-right-door")} style={{ cursor: "pointer" }}
          className="car-part hover:opacity-80 transition-opacity"
        />
        {/* Rear Right Door */}
        <rect x="145" y="170" width="25" height="45" rx="3"
          fill={selectedPoint === "rear-right-door" ? "#fed7d7" : "#f7fafc"}
          stroke={selectedPoint === "rear-right-door" ? "#e53e3e" : "#4a5568"}
          strokeWidth={selectedPoint === "rear-right-door" ? "1.5" : "0.8"}
          onClick={() => handleClick("rear-right-door")} style={{ cursor: "pointer" }}
          className="car-part hover:opacity-80 transition-opacity"
        />
        {/* Rear Right Fender */}
        <rect x="145" y="250" width="25" height="50" rx="5"
          fill={selectedPoint === "rear-right-fender" ? "#fed7d7" : "#f7fafc"}
          stroke={selectedPoint === "rear-right-fender" ? "#e53e3e" : "#4a5568"}
          strokeWidth={selectedPoint === "rear-right-fender" ? "1.5" : "0.8"}
          onClick={() => handleClick("rear-right-fender")} style={{ cursor: "pointer" }}
          className="car-part hover:opacity-80 transition-opacity"
        />

        {/* --- Non-Clickable Details --- */}
        {/* Wheels */}
        <circle cx="35" cy="105" r="15" fill="#a0aec0" stroke="#4a5568" strokeWidth="0.5" />
        <circle cx="35" cy="235" r="15" fill="#a0aec0" stroke="#4a5568" strokeWidth="0.5" />
        <circle cx="165" cy="105" r="15" fill="#a0aec0" stroke="#4a5568" strokeWidth="0.5" />
        <circle cx="165" cy="235" r="15" fill="#a0aec0" stroke="#4a5568" strokeWidth="0.5" />

        {/* Mirrors */}
        <rect x="15" y="115" width="15" height="10" rx="3" fill="#a0aec0" stroke="#4a5568" strokeWidth="0.5" />
        <rect x="170" y="115" width="15" height="10" rx="3" fill="#a0aec0" stroke="#4a5568" strokeWidth="0.5" />

        {/* Pillars (simple lines) */}
        <line x1="55" y1="90" x2="60" y2="125" strokeWidth="2" stroke="#a0aec0" /> {/* A-Pillar L */}
        <line x1="145" y1="90" x2="140" y2="125" strokeWidth="2" stroke="#a0aec0" /> {/* A-Pillar R */}
        <line x1="55" y1="170" x2="55" y2="125" strokeWidth="3" stroke="#a0aec0" /> {/* B-Pillar L */}
        <line x1="145" y1="170" x2="145" y2="125" strokeWidth="3" stroke="#a0aec0" /> {/* B-Pillar R */}
        <line x1="55" y1="215" x2="60" y2="250" strokeWidth="2" stroke="#a0aec0" /> {/* C-Pillar L */}
        <line x1="145" y1="215" x2="140" y2="250" strokeWidth="2" stroke="#a0aec0" /> {/* C-Pillar R */}

      </g>
    </svg>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-lg" style={{ backgroundColor: '#E8F0FB' }}>
      <h2 className="text-xl font-semibold">Punctul Inițial de Impact</h2>

      <p className="text-sm text-gray-500">
        Indicați printr-o apăsare punctul inițial de impact pentru fiecare vehicul. Puteți apăsa din nou pentru a deselecta.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Use grid for better layout */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-center mb-2">Vehicul A (Al Meu)</h3>
            {/* Container for SVG with aspect ratio padding hack */}
            <div className="relative w-full bg-gray-50 border border-gray-300 rounded-md mb-2 overflow-hidden" style={{ paddingBottom: '170%' }}> {/* Adjust padding % based on viewBox ratio (340/200 * 100) */}
              <SvgCar
                selectedPoint={impactPoints.vehicleA}
                handleClick={handleVehicleAClick}
               />
            </div>
            <p className="text-sm text-center h-5"> {/* Fixed height to prevent layout shift */}
              {impactPoints.vehicleA
                ? `Punct selectat: ${getAreaLabel(impactPoints.vehicleA)}`
                : "Niciun punct selectat"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-center mb-2">Vehicul B (Celălalt)</h3>
             {/* Container for SVG */}
            <div className="relative w-full bg-gray-50 border border-gray-300 rounded-md mb-2 overflow-hidden" style={{ paddingBottom: '170%' }}>
               <SvgCar
                  selectedPoint={impactPoints.vehicleB}
                  handleClick={handleVehicleBClick}
               />
            </div>
            <p className="text-sm text-center h-5"> {/* Fixed height */}
              {impactPoints.vehicleB
                ? `Punct selectat: ${getAreaLabel(impactPoints.vehicleB)}`
                : "Niciun punct selectat"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Înapoi
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-[#0066CC] hover:bg-[#0052a3] text-white" // Added text-white for better contrast
          // Enable continue button even if points are not selected, validation might happen later
          // disabled={impactPoints.vehicleA === null || impactPoints.vehicleB === null}
        >
          Continuă
        </Button>
      </div>
    </form>
  )
}