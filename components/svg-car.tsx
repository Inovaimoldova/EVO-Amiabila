"use client"

import { cn } from "@/lib/utils"

interface SvgCarProps {
  selectedArea: string | null
  onAreaSelect: (area: string) => void
  className?: string
  multiSelect?: boolean
  selectedAreas?: string[]
}

export default function SvgCar({
  selectedArea,
  onAreaSelect,
  className,
  multiSelect = false,
  selectedAreas = [],
}: SvgCarProps) {
  const handleAreaClick = (area: string) => {
    onAreaSelect(area)
  }

  const isSelected = (area: string) => {
    if (multiSelect) {
      return selectedAreas.includes(area)
    }
    return selectedArea === area
  }

  return (
    <svg viewBox="0 0 800 400" className={cn("w-full", className)}>
      {/* Car outline */}
      <path
        d="M200,300 L200,200 L300,100 L500,100 L600,200 L600,300 Z"
        fill="#f1f5f9"
        stroke="#0f172a"
        strokeWidth="2"
      />

      {/* Front bumper */}
      <path
        d="M200,300 L200,250 L250,250 L250,300 Z"
        fill={isSelected("front-bumper") ? "#3b82f6" : "#e2e8f0"}
        stroke="#0f172a"
        strokeWidth="2"
        onClick={() => handleAreaClick("front-bumper")}
        onTouchStart={(e) => {
          e.preventDefault()
          handleAreaClick("front-bumper")
        }}
        className="cursor-pointer hover:fill-blue-200"
      />

      {/* Hood */}
      <path
        d="M250,250 L250,150 L300,100 L500,100 L500,150 L250,150 Z"
        fill={isSelected("hood") ? "#3b82f6" : "#e2e8f0"}
        stroke="#0f172a"
        strokeWidth="2"
        onClick={() => handleAreaClick("hood")}
        onTouchStart={(e) => {
          e.preventDefault()
          handleAreaClick("hood")
        }}
        className="cursor-pointer hover:fill-blue-200"
      />

      {/* Windshield */}
      <path
        d="M500,150 L500,100 L550,150 Z"
        fill={isSelected("windshield") ? "#3b82f6" : "#e2e8f0"}
        stroke="#0f172a"
        strokeWidth="2"
        onClick={() => handleAreaClick("windshield")}
        onTouchStart={(e) => {
          e.preventDefault()
          handleAreaClick("windshield")
        }}
        className="cursor-pointer hover:fill-blue-200"
      />

      {/* Roof */}
      <path
        d="M500,150 L550,150 L550,250 L500,250 Z"
        fill={isSelected("roof") ? "#3b82f6" : "#e2e8f0"}
        stroke="#0f172a"
        strokeWidth="2"
        onClick={() => handleAreaClick("roof")}
        onTouchStart={(e) => {
          e.preventDefault()
          handleAreaClick("roof")
        }}
        className="cursor-pointer hover:fill-blue-200"
      />

      {/* Trunk */}
      <path
        d="M550,250 L550,150 L600,200 L600,250 Z"
        fill={isSelected("trunk") ? "#3b82f6" : "#e2e8f0"}
        stroke="#0f172a"
        strokeWidth="2"
        onClick={() => handleAreaClick("trunk")}
        onTouchStart={(e) => {
          e.preventDefault()
          handleAreaClick("trunk")
        }}
        className="cursor-pointer hover:fill-blue-200"
      />

      {/* Rear bumper */}
      <path
        d="M550,250 L600,250 L600,300 L550,300 Z"
        fill={isSelected("rear-bumper") ? "#3b82f6" : "#e2e8f0"}
        stroke="#0f172a"
        strokeWidth="2"
        onClick={() => handleAreaClick("rear-bumper")}
        onTouchStart={(e) => {
          e.preventDefault()
          handleAreaClick("rear-bumper")
        }}
        className="cursor-pointer hover:fill-blue-200"
      />

      {/* Left front door */}
      <path
        d="M250,150 L250,250 L350,250 L350,150 Z"
        fill={isSelected("left-front-door") ? "#3b82f6" : "#e2e8f0"}
        stroke="#0f172a"
        strokeWidth="2"
        onClick={() => handleAreaClick("left-front-door")}
        onTouchStart={(e) => {
          e.preventDefault()
          handleAreaClick("left-front-door")
        }}
        className="cursor-pointer hover:fill-blue-200"
      />

      {/* Left rear door */}
      <path
        d="M350,150 L350,250 L450,250 L450,150 Z"
        fill={isSelected("left-rear-door") ? "#3b82f6" : "#e2e8f0"}
        stroke="#0f172a"
        strokeWidth="2"
        onClick={() => handleAreaClick("left-rear-door")}
        onTouchStart={(e) => {
          e.preventDefault()
          handleAreaClick("left-rear-door")
        }}
        className="cursor-pointer hover:fill-blue-200"
      />

      {/* Left quarter panel */}
      <path
        d="M450,150 L450,250 L500,250 L500,150 Z"
        fill={isSelected("left-rear-fender") ? "#3b82f6" : "#e2e8f0"}
        stroke="#0f172a"
        strokeWidth="2"
        onClick={() => handleAreaClick("left-rear-fender")}
        onTouchStart={(e) => {
          e.preventDefault()
          handleAreaClick("left-rear-fender")
        }}
        className="cursor-pointer hover:fill-blue-200"
      />

      {/* Bottom panel */}
      <path
        d="M250,250 L550,250 L550,300 L250,300 Z"
        fill={isSelected("bottom") ? "#3b82f6" : "#e2e8f0"}
        stroke="#0f172a"
        strokeWidth="2"
        onClick={() => handleAreaClick("bottom")}
        onTouchStart={(e) => {
          e.preventDefault()
          handleAreaClick("bottom")
        }}
        className="cursor-pointer hover:fill-blue-200"
      />

      {/* Wheels */}
      <circle cx="300" cy="300" r="30" fill="#0f172a" stroke="#0f172a" strokeWidth="2" />
      <circle cx="500" cy="300" r="30" fill="#0f172a" stroke="#0f172a" strokeWidth="2" />

      {/* Labels */}
      <text x="400" y="350" textAnchor="middle" className="text-xs">
        Față ← → Spate
      </text>
      <text x="400" y="50" textAnchor="middle" className="text-sm font-medium">
        Selectați zona de impact
      </text>
    </svg>
  )
}
