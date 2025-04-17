"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { KeyboardInput } from "@/components/virtual-keyboard/keyboard-input"

interface CableFormProps {
  onSave: (cable: {
    type: string
    name: string
    color: string
    size: string
    id: string
  }) => void
  onCancel: () => void
}

export function CableForm({ onSave, onCancel }: CableFormProps) {
  const [cableType, setCableType] = useState("")
  const [cableName, setCableName] = useState("")
  const [cableColor, setCableColor] = useState("")
  const [cableSize, setCableSize] = useState("")
  const [cableId, setCableId] = useState("")

  const handleSave = () => {
    onSave({
      type: cableType,
      name: cableName,
      color: cableColor,
      size: cableSize,
      id: cableId,
    })
  }

  const colors = [
    { name: "Rouge", class: "bg-red-500" },
    { name: "Bleu", class: "bg-blue-500" },
    { name: "Vert", class: "bg-green-500" },
    { name: "Jaune", class: "bg-yellow-400" },
    { name: "Noir", class: "bg-black" },
  ]

  const sizes = ["0.5mm²", "0.75mm²", "1.0mm²", "1.5mm²", "2.5mm²", "4.0mm²", "6.0mm²", "10.0mm²"]

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Type de câble</label>
        <KeyboardInput value={cableType} onChange={setCableType} placeholder="Entrez une valeur" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Nom du câble</label>
        <KeyboardInput value={cableName} onChange={setCableName} placeholder="Entrez une valeur" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Couleur</label>
        <div className="flex gap-2">
          {colors.map((color) => (
            <button
              key={color.name}
              className={`w-12 h-8 rounded ${color.class} ${
                cableColor === color.name ? "ring-2 ring-offset-2 ring-blue-500" : ""
              }`}
              onClick={() => setCableColor(color.name)}
              aria-label={color.name}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Taille</label>
        <Select value={cableSize} onValueChange={setCableSize}>
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Sélectionner une taille" />
          </SelectTrigger>
          <SelectContent>
            {sizes.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">ID du câble</label>
        <KeyboardInput value={cableId} onChange={setCableId} placeholder="Entrez une valeur" />
      </div>

      <div className="flex gap-2 pt-4">
        <Button className="flex-1 bg-blue-500 hover:bg-blue-600" onClick={handleSave}>
          Enregistrer
        </Button>
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </div>
  )
}
