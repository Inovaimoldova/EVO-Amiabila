export interface AccidentFormData {
  conditions: {
    confirmed: boolean
  }
  dateTime: {
    date: string
    time: string
  }
  location: {
    city: string
    street: string
    number: string
  }
  witnesses: {
    hasWitnesses: boolean | undefined
    list: Witness[]
  }
  circumstances: {
    vehicleAStatus: "stationary" | "moving" | undefined
    vehicleAAction: string | undefined
    vehicleBStatus: "stationary" | "moving" | undefined
    vehicleBAction: string | undefined
    roadConditions: string[]
  }
  vehicleA: Vehicle
  driverA: Driver
  vehicleB: Vehicle
  driverB: Driver
  sketch: string | null
  impactPoints: {
    vehicleA: string | null
    vehicleB: string | null
  }
  damages: {
    vehicleA: DamageDetails
    vehicleB: DamageDetails
  }
  responsibility: {
    party: "A" | "B" | undefined
  }
  notes: string
  signatures: {
    partyA: string | null
    partyB: string | null
  }
}

export interface Witness {
  id: string
  firstName: string
  lastName: string
  address: string
  phone: string
}

export interface Vehicle {
  make: string
  model: string
  plateNumber: string
  vin: string
  hasTrailer: boolean
  trailerPlate: string
  trailerVin: string
  insurance: {
    company: string
    policyNumber: string
    validFrom: string
    validTo: string
    insuredName: string
    insuredAddress: string
  }
}

export interface Driver {
  firstName: string
  lastName: string
  idnp: string
  address: string
  phone: string
  license: {
    number: string
    categories: string
    issueDate: string
    expiryDate: string
  }
}

export interface DamageDetails {
  photos: string[]
  description: string
  areas: string[]
}

export const VEHICLE_AREAS = [
  "front-bumper",
  "hood",
  "windshield",
  "roof",
  "trunk",
  "rear-bumper",
  "left-front-door",
  "left-rear-door",
  "left-front-fender",
  "left-rear-fender",
  "right-front-door",
  "right-rear-door",
  "right-front-fender",
  "right-rear-fender",
  "left-headlight",
  "right-headlight",
  "left-taillight",
  "right-taillight",
]

export const ROAD_CONDITIONS = [
  "Uscat",
  "Umed",
  "Gheață/Zăpadă",
  "Noroi",
  "Lucrări în desfășurare",
  "Vizibilitate redusă",
]

export const VEHICLE_ACTIONS = [
  "Mergea înainte",
  "Schimba banda",
  "Depășea",
  "Vira la dreapta",
  "Vira la stânga",
  "Mergea cu spatele",
  "Intra/Ieșea din parcare",
  "Intra/Circula în sens giratoriu",
]
