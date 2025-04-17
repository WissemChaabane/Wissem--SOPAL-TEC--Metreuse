"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ChevronLeft, List, CheckCircle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { KeyboardInput } from "@/components/virtual-keyboard/keyboard-input"
import { dataService } from "@/lib/data-service"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function MeasurementScreen() {
  const router = useRouter()
  const [length, setLength] = useState("")
  const [unit, setUnit] = useState<"m" | "mm">("m")
  const [currentMeasurement, setCurrentMeasurement] = useState(0)
  const [targetMeasurement, setTargetMeasurement] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [cutCount, setCutCount] = useState(0)
  const [cableInfo, setCableInfo] = useState<{
    type: string
    user: string
    project: string
    network?: string
    color: string
    size: string
    id: string
  } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const animationRef = useRef<number | null>(null)
  const [successMessage, setSuccessMessage] = useState("Coupe enregistrée avec succès!")

  // Load selected cable and user/project information
  useEffect(() => {
    dataService.initialize()

    // Get the selected cable ID from localStorage
    const selectedCableId = localStorage.getItem("selectedCableId")
    const selectedUserId = localStorage.getItem("selectedUserId")
    const selectedProjectId = localStorage.getItem("selectedProjectId")

    if (selectedCableId) {
      const cables = dataService.getCables()
      const cable = cables.find((c) => c.id === selectedCableId)

      const users = dataService.getUsers()
      const projects = dataService.getProjects()

      const user = users.find((u) => u.id === selectedUserId)
      const project = projects.find((p) => p.id === selectedProjectId)

      if (cable) {
        setCableInfo({
          type: cable.type,
          user: user?.name || "Utilisateur inconnu",
          project: project?.name || "Projet inconnu",
          color: cable.color,
          size: cable.size,
          id: cable.id,
        })
      }
    }
  }, [])

  // Animation effect for the measurement value
  useEffect(() => {
    if (length) {
      const newTarget = Number.parseFloat(length) || 0
      setTargetMeasurement(newTarget)

      // Simulate sensor data updates
      const interval = setInterval(() => {
        setCurrentMeasurement((prevMeasurement) => {
          const current = prevMeasurement
          if (current < newTarget) {
            return Math.min(current + Math.random() * 0.3, newTarget)
          }
          return current
        })
      }, 500)

      return () => clearInterval(interval)
    } else {
      setTargetMeasurement(0)
      setCurrentMeasurement(0)
    }
  }, [length])

  // Hide success message after 3 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showSuccess])

  const handleInputChange = (value: string) => {
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setLength(value)
    }
  }

  const handleConfirm = () => {
    if (length && currentMeasurement > 0 && cableInfo) {
      // Add the cut to history
      const now = new Date()
      const date = now.toLocaleDateString("fr-FR")
      const time = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })

      dataService.addCut({
        date,
        time,
        user: cableInfo.user,
        project: cableInfo.project,
        cableType: cableInfo.type,
        cableColor: cableInfo.color,
        cableSize: cableInfo.size,
        cableId: cableInfo.id,
        length: currentMeasurement.toFixed(1),
        unit,
      })

      // Store the current measurement before resetting
      const recordedMeasurement = currentMeasurement.toFixed(1)
      const recordedUnit = unit

      // Show success message and reset form
      setShowSuccess(true)
      setCutCount(cutCount + 1)
      setLength("")
      setCurrentMeasurement(0)
      setTargetMeasurement(0)

      // Update the success message with the correct measurement
      setSuccessMessage(`Coupe enregistrée avec succès! (${recordedMeasurement} ${recordedUnit})`)
    }
  }

  const handleBack = () => {
    router.push("/select-cable")
  }

  const handleHistoryClick = () => {
    router.push("/dashboard?panel=historique")
  }

  // Format the displayed measurement value
  const formattedMeasurement = currentMeasurement.toFixed(1)

  return (
    <div className="max-w-[480px] mx-auto min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button onClick={handleBack} className="text-gray-600">
          <ChevronLeft size={24} />
        </button>
        <div className="mx-auto">
          <Image src="/images/sopal-logo.png" alt="SOPAL TEC" width={120} height={40} priority />
        </div>
        <Button variant="outline" size="icon" className="h-10 w-10" onClick={handleHistoryClick}>
          <List className="h-4 w-4" />
        </Button>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-medium text-center text-blue-500 mb-6">Mesure</h1>

      {/* Success Alert */}
      {showSuccess && (
        <div className="mx-4 mb-4">
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">{successMessage}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Cut Counter */}
      {cutCount > 0 && (
        <div className="mx-4 mb-4 text-center">
          <span className="text-sm font-medium text-gray-600">
            Coupes effectuées: <span className="font-bold text-blue-500">{cutCount}</span>
          </span>
        </div>
      )}

      {cableInfo && (
        <div className="mx-4 p-4 bg-gray-50 rounded-md mb-6">
          <h2 className="text-xl font-medium mb-2">Types de câbles: {cableInfo.type}</h2>
          <p className="text-sm text-gray-600">
            {cableInfo.user} | {cableInfo.project} | {cableInfo.color} | {cableInfo.size}
          </p>
        </div>
      )}

      {/* Measurement Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
        {/* Left Panel */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-4">Entrer la longueur de coupe</h3>

          <RadioGroup value={unit} onValueChange={(value) => setUnit(value as "m" | "mm")} className="flex gap-6 mb-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="m" id="m" />
              <Label htmlFor="m">m</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mm" id="mm" />
              <Label htmlFor="mm">mm</Label>
            </div>
          </RadioGroup>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Longueur</label>
            <div className="relative">
              <KeyboardInput
                value={length}
                onChange={handleInputChange}
                placeholder="Entrez une valeur"
                type="numeric"
                onEnter={handleConfirm}
                className="pr-8"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">{unit}</div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-gray-50 p-4 rounded-md flex flex-col">
          <h3 className="text-lg font-medium mb-4">Mesure actuelle du longueur</h3>

          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-6xl font-bold text-blue-500 mb-2">{formattedMeasurement}</div>
            <div className="text-xl">{unit}</div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: targetMeasurement ? `${Math.min((currentMeasurement / targetMeasurement) * 100, 100)}%` : "0%",
                }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>0 {unit}</span>
              <span>
                {targetMeasurement || "?"} {unit}
              </span>
            </div>
          </div>

          <Button
            className="mt-6 py-6 bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2"
            onClick={handleConfirm}
            disabled={!length || currentMeasurement === 0}
          >
            <CheckCircle className="h-5 w-5" />
            <span>Confirmation de coupage</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
