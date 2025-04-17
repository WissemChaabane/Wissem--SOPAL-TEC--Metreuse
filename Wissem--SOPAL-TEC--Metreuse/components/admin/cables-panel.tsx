"use client"

import { useState, useEffect } from "react"
import { Trash2, Edit, Search, CableIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VirtualKeyboard } from "@/components/virtual-keyboard/virtual-keyboard"
import { dataService, type Cable } from "@/lib/data-service"

export function CablesPanel() {
  const [cables, setCables] = useState<Cable[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCable, setSelectedCable] = useState<Cable | null>(null)
  const [showDialogKeyboard, setShowDialogKeyboard] = useState(false)
  const [dialogField, setDialogField] = useState<string>("")

  const [newCable, setNewCable] = useState({
    name: "",
    type: "",
    color: "Rouge",
    size: "0.5mm²",
    id: "",
  })

  const [editedCable, setEditedCable] = useState({
    name: "",
    type: "",
    color: "",
    size: "",
    id: "",
  })

  // Load cables on component mount
  useEffect(() => {
    dataService.initialize()
    setCables(dataService.getCables())
  }, [])

  const filteredCables = cables.filter((cable) => {
    if (!searchTerm) return true
    return (
      cable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cable.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cable.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const handleAddCable = () => {
    if (newCable.name.trim() && newCable.type.trim() && newCable.id.trim()) {
      const cableToAdd = {
        ...newCable,
        usageCount: 0,
      }
      const updatedCables = [...cables, cableToAdd]
      setCables(updatedCables)
      dataService.saveCables(updatedCables)
      setNewCable({
        name: "",
        type: "",
        color: "Rouge",
        size: "0.5mm²",
        id: "",
      })
      setIsAddDialogOpen(false)
      setShowDialogKeyboard(false)
    }
  }

  const handleEdit = (cable: Cable) => {
    setSelectedCable(cable)
    setEditedCable({
      name: cable.name,
      type: cable.type,
      color: cable.color,
      size: cable.size,
      id: cable.id,
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (cable: Cable) => {
    setSelectedCable(cable)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedCable) {
      const updatedCables = cables.filter((cable) => cable.id !== selectedCable.id)
      setCables(updatedCables)
      dataService.saveCables(updatedCables)
      setIsDeleteDialogOpen(false)
    }
  }

  const saveEdit = () => {
    if (selectedCable && editedCable.name.trim() && editedCable.type.trim() && editedCable.id.trim()) {
      const updatedCables = cables.map((cable) =>
        cable.id === selectedCable.id
          ? {
              ...cable,
              name: editedCable.name,
              type: editedCable.type,
              color: editedCable.color,
              size: editedCable.size,
              id: editedCable.id,
            }
          : cable,
      )
      setCables(updatedCables)
      dataService.saveCables(updatedCables)
      setIsEditDialogOpen(false)
      setShowDialogKeyboard(false)
    }
  }

  const handleKeyPress = (key: string) => {
    if (key === "backspace") {
      setSearchTerm(searchTerm.slice(0, -1))
    } else {
      setSearchTerm(searchTerm + key)
    }
  }

  const handleDialogKeyPress = (key: string) => {
    if (key === "backspace") {
      if (isAddDialogOpen) {
        if (dialogField === "name") {
          setNewCable({ ...newCable, name: newCable.name.slice(0, -1) })
        } else if (dialogField === "type") {
          setNewCable({ ...newCable, type: newCable.type.slice(0, -1) })
        } else if (dialogField === "id") {
          setNewCable({ ...newCable, id: newCable.id.slice(0, -1) })
        }
      } else if (isEditDialogOpen) {
        if (dialogField === "name") {
          setEditedCable({ ...editedCable, name: editedCable.name.slice(0, -1) })
        } else if (dialogField === "type") {
          setEditedCable({ ...editedCable, type: editedCable.type.slice(0, -1) })
        } else if (dialogField === "id") {
          setEditedCable({ ...editedCable, id: editedCable.id.slice(0, -1) })
        }
      }
    } else {
      if (isAddDialogOpen) {
        if (dialogField === "name") {
          setNewCable({ ...newCable, name: newCable.name + key })
        } else if (dialogField === "type") {
          setNewCable({ ...newCable, type: newCable.type + key })
        } else if (dialogField === "id") {
          setNewCable({ ...newCable, id: newCable.id + key })
        }
      } else if (isEditDialogOpen) {
        if (dialogField === "name") {
          setEditedCable({ ...editedCable, name: editedCable.name + key })
        } else if (dialogField === "type") {
          setEditedCable({ ...editedCable, type: editedCable.type + key })
        } else if (dialogField === "id") {
          setEditedCable({ ...editedCable, id: editedCable.id + key })
        }
      }
    }
  }

  const colorOptions = [
    { name: "Rouge", class: "bg-red-500" },
    { name: "Bleu", class: "bg-blue-500" },
    { name: "Vert", class: "bg-green-500" },
    { name: "Jaune", class: "bg-yellow-400" },
    { name: "Noir", class: "bg-black" },
    { name: "Orange", class: "bg-orange-400" },
  ]

  const sizeOptions = ["0.5mm²", "0.75mm²", "1.0mm²", "1.5mm²", "2.5mm²", "4.0mm²", "6.0mm²", "10.0mm²"]

  const getColorClass = (color: string) => {
    switch (color.toLowerCase()) {
      case "rouge":
        return "bg-red-500"
      case "bleu":
        return "bg-blue-500"
      case "orange":
        return "bg-orange-400"
      case "vert":
        return "bg-green-500"
      case "jaune":
        return "bg-yellow-400"
      case "noir":
        return "bg-black"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Câbles</h2>
        <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
          <CableIcon className="h-4 w-4" />
          Ajouter un câble
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Rechercher un câble"
          className="pl-10 pr-4 py-2 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={() => setShowKeyboard(true)}
          readOnly
        />
        {showKeyboard && (
          <div className="absolute z-50 w-full mt-2">
            <VirtualKeyboard
              onKeyPress={handleKeyPress}
              onEnter={() => setShowKeyboard(false)}
              onClose={() => setShowKeyboard(false)}
              keyboardType="text"
              position="inline"
              className="border rounded-md shadow-lg"
            />
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Nom</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Couleur</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Taille</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Utilisations</th>
              <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCables.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Aucun câble trouvé
                </td>
              </tr>
            ) : (
              filteredCables.map((cable) => (
                <tr key={cable.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{cable.id}</td>
                  <td className="py-3 px-4 font-medium">{cable.name}</td>
                  <td className="py-3 px-4">{cable.type}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${getColorClass(cable.color)}`}></div>
                      <span>{cable.color}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{cable.size}</td>
                  <td className="py-3 px-4">{cable.usageCount}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEdit(cable)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleDelete(cable)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Cable Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open)
          if (!open) {
            setNewCable({
              name: "",
              type: "",
              color: "Rouge",
              size: "0.5mm²",
              id: "",
            })
            setShowDialogKeyboard(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un câble</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label className="text-sm font-medium">Type de câble</label>
              <Input
                value={newCable.type}
                onChange={(e) => setNewCable({ ...newCable, type: e.target.value })}
                placeholder="Entrez le type de câble"
                className="mt-1"
                onClick={() => {
                  setDialogField("type")
                  setShowDialogKeyboard(true)
                }}
                readOnly
              />
            </div>
            <div>
              <label className="text-sm font-medium">Nom du câble</label>
              <Input
                value={newCable.name}
                onChange={(e) => setNewCable({ ...newCable, name: e.target.value })}
                placeholder="Entrez le nom du câble"
                className="mt-1"
                onClick={() => {
                  setDialogField("name")
                  setShowDialogKeyboard(true)
                }}
                readOnly
              />
            </div>
            <div>
              <label className="text-sm font-medium">Couleur</label>
              <div className="flex gap-2 mt-1">
                {colorOptions.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    className={`w-8 h-8 rounded-full ${color.class} ${
                      newCable.color === color.name ? "ring-2 ring-offset-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setNewCable({ ...newCable, color: color.name })}
                    aria-label={color.name}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Taille</label>
              <Select value={newCable.size} onValueChange={(value) => setNewCable({ ...newCable, size: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionner une taille" />
                </SelectTrigger>
                <SelectContent>
                  {sizeOptions.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">ID du câble</label>
              <Input
                value={newCable.id}
                onChange={(e) => setNewCable({ ...newCable, id: e.target.value })}
                placeholder="Entrez l'ID du câble"
                className="mt-1"
                onClick={() => {
                  setDialogField("id")
                  setShowDialogKeyboard(true)
                }}
                readOnly
              />
            </div>
            {showDialogKeyboard && (
              <div className="mt-4">
                <VirtualKeyboard
                  onKeyPress={handleDialogKeyPress}
                  onEnter={handleAddCable}
                  onClose={() => setShowDialogKeyboard(false)}
                  keyboardType="text"
                  position="inline"
                  className="border rounded-md"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleAddCable}
              disabled={!newCable.name.trim() || !newCable.type.trim() || !newCable.id.trim()}
            >
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Cable Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open)
          if (!open) {
            setEditedCable({
              name: "",
              type: "",
              color: "",
              size: "",
              id: "",
            })
            setShowDialogKeyboard(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier le câble</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label className="text-sm font-medium">Type de câble</label>
              <Input
                value={editedCable.type}
                onChange={(e) => setEditedCable({ ...editedCable, type: e.target.value })}
                placeholder="Entrez le type de câble"
                className="mt-1"
                onClick={() => {
                  setDialogField("type")
                  setShowDialogKeyboard(true)
                }}
                readOnly
              />
            </div>
            <div>
              <label className="text-sm font-medium">Nom du câble</label>
              <Input
                value={editedCable.name}
                onChange={(e) => setEditedCable({ ...editedCable, name: e.target.value })}
                placeholder="Entrez le nom du câble"
                className="mt-1"
                onClick={() => {
                  setDialogField("name")
                  setShowDialogKeyboard(true)
                }}
                readOnly
              />
            </div>
            <div>
              <label className="text-sm font-medium">Couleur</label>
              <div className="flex gap-2 mt-1">
                {colorOptions.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    className={`w-8 h-8 rounded-full ${color.class} ${
                      editedCable.color === color.name ? "ring-2 ring-offset-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setEditedCable({ ...editedCable, color: color.name })}
                    aria-label={color.name}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Taille</label>
              <Select
                value={editedCable.size}
                onValueChange={(value) => setEditedCable({ ...editedCable, size: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionner une taille" />
                </SelectTrigger>
                <SelectContent>
                  {sizeOptions.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">ID du câble</label>
              <Input
                value={editedCable.id}
                onChange={(e) => setEditedCable({ ...editedCable, id: e.target.value })}
                placeholder="Entrez l'ID du câble"
                className="mt-1"
                onClick={() => {
                  setDialogField("id")
                  setShowDialogKeyboard(true)
                }}
                readOnly
              />
            </div>
            {showDialogKeyboard && (
              <div className="mt-4">
                <VirtualKeyboard
                  onKeyPress={handleDialogKeyPress}
                  onEnter={saveEdit}
                  onClose={() => setShowDialogKeyboard(false)}
                  keyboardType="text"
                  position="inline"
                  className="border rounded-md"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={saveEdit}
              disabled={!editedCable.name.trim() || !editedCable.type.trim() || !editedCable.id.trim()}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Êtes-vous sûr de vouloir supprimer ce câble ?</p>
            {selectedCable && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
                <p>
                  <strong>ID:</strong> {selectedCable.id}
                </p>
                <p>
                  <strong>Nom:</strong> {selectedCable.name}
                </p>
                <p>
                  <strong>Type:</strong> {selectedCable.type}
                </p>
                <p>
                  <strong>Couleur:</strong> {selectedCable.color}
                </p>
                <p>
                  <strong>Taille:</strong> {selectedCable.size}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
