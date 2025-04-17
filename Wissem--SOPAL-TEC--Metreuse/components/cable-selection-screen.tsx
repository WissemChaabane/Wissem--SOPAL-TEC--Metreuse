"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ChevronLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CableCard } from "@/components/cable-card"
import { CableForm } from "@/components/cable-form"
import { dataService, type Cable } from "@/lib/data-service"

export function CableSelectionScreen() {
  const router = useRouter()
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedCable, setSelectedCable] = useState<string | null>(null)
  const [cables, setCables] = useState<Cable[]>([])

  // Load cables from data service when component mounts
  useEffect(() => {
    dataService.initialize()
    setCables(dataService.getCables())
  }, [])

  const handleAddCable = (cable: {
    type: string
    name: string
    color: string
    size: string
    id: string
  }) => {
    const newCable = {
      ...cable,
      usageCount: 0,
    }
    const updatedCables = [...cables, newCable]
    setCables(updatedCables)
    dataService.saveCables(updatedCables)
    setShowAddForm(false)
  }

  // Update the handleContinue function to save the selected cable ID to localStorage
  const handleContinue = () => {
    if (selectedCable) {
      // Save the selected cable ID to localStorage
      localStorage.setItem("selectedCableId", selectedCable)
      router.push("/measurement")
    }
  }

  const handleBack = () => {
    router.push("/")
  }

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
        <div className="w-6"></div> {/* Empty div for alignment */}
      </div>

      {/* Title */}
      <h1 className="text-2xl font-medium text-center text-blue-500 mb-6">Sélectionner un câble</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-medium mb-4">Types de câbles</h2>

          {showAddForm ? (
            <CableForm onSave={handleAddCable} onCancel={() => setShowAddForm(false)} />
          ) : (
            <Button
              variant="outline"
              className="w-full py-6 border-dashed border-2 flex items-center justify-center gap-2"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="h-5 w-5" />
              <span>Nouveau type de câble</span>
            </Button>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-medium mb-4">Sélectionner un câble</h2>

          <div className="space-y-2">
            {cables.length === 0 ? (
              <div className="text-center py-4 text-gray-500">Aucun câble disponible</div>
            ) : (
              cables.map((cable) => (
                <CableCard
                  key={cable.id}
                  id={cable.id}
                  name={cable.name}
                  type={cable.type}
                  color={cable.color}
                  size={cable.size}
                  isSelected={selectedCable === cable.id}
                  onClick={() => setSelectedCable(cable.id)}
                />
              ))
            )}
          </div>

          <Button
            className="w-full mt-6 bg-blue-500 hover:bg-blue-600"
            disabled={!selectedCable}
            onClick={handleContinue}
          >
            Continuer
          </Button>
        </div>
      </div>
    </div>
  )
}
