"use client"

import { useState, useEffect } from "react"
import { Trash2, Edit, Search, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VirtualKeyboard } from "@/components/virtual-keyboard/virtual-keyboard"
import { dataService, type CutHistory } from "@/lib/data-service"
import { ExportDialog } from "@/components/export-dialog"

export function HistoryPanel() {
  const [historyData, setHistoryData] = useState<CutHistory[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<CutHistory | null>(null)
  const [editedEntry, setEditedEntry] = useState<CutHistory | null>(null)

  // Load history on component mount
  useEffect(() => {
    dataService.initialize()
    setHistoryData(dataService.getHistory())
  }, [])

  const filteredData = historyData.filter((entry) => {
    if (!searchTerm) return true

    const searchLower = searchTerm.toLowerCase()
    return (
      entry.user.toLowerCase().includes(searchLower) ||
      entry.project.toLowerCase().includes(searchLower) ||
      entry.cableType.toLowerCase().includes(searchLower) ||
      entry.cableId.toLowerCase().includes(searchLower)
    )
  })

  const handleEdit = (entry: CutHistory) => {
    setSelectedEntry(entry)
    setEditedEntry({ ...entry })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (entry: CutHistory) => {
    setSelectedEntry(entry)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedEntry) {
      const updatedHistory = historyData.filter((entry) => entry.id !== selectedEntry.id)
      setHistoryData(updatedHistory)
      dataService.saveHistory(updatedHistory)
      setIsDeleteDialogOpen(false)
    }
  }

  const saveEdit = () => {
    if (editedEntry) {
      const updatedHistory = historyData.map((entry) => (entry.id === editedEntry.id ? editedEntry : entry))
      setHistoryData(updatedHistory)
      dataService.saveHistory(updatedHistory)
      setIsEditDialogOpen(false)
    }
  }

  const exportData = () => {
    setIsExportDialogOpen(true)
  }

  const handleKeyPress = (key: string) => {
    if (key === "backspace") {
      setSearchTerm(searchTerm.slice(0, -1))
    } else {
      setSearchTerm(searchTerm + key)
    }
  }

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
        <h2 className="text-xl font-bold">Historique de coupe</h2>
        <Button variant="outline" onClick={exportData} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exporter
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Rechercher"
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
              <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Câble</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Utilisateur</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Projet</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Longueur</th>
              <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  Aucun résultat trouvé
                </td>
              </tr>
            ) : (
              filteredData.map((entry) => (
                <tr key={entry.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{`${entry.date} ${entry.time}`}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${getColorClass(entry.cableColor)}`}></div>
                      <span>{entry.cableType}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{entry.user}</td>
                  <td className="py-3 px-4">{entry.project}</td>
                  <td className="py-3 px-4">{`${entry.length} ${entry.unit}`}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEdit(entry)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleDelete(entry)}>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier l'entrée</DialogTitle>
          </DialogHeader>
          {editedEntry && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <Input
                    type="date"
                    value={editedEntry.date}
                    onChange={(e) => setEditedEntry({ ...editedEntry, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Heure</label>
                  <Input
                    type="time"
                    value={editedEntry.time}
                    onChange={(e) => setEditedEntry({ ...editedEntry, time: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Utilisateur</label>
                <Input
                  value={editedEntry.user}
                  onChange={(e) => setEditedEntry({ ...editedEntry, user: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Projet</label>
                <Input
                  value={editedEntry.project}
                  onChange={(e) => setEditedEntry({ ...editedEntry, project: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Type de câble</label>
                <Input
                  value={editedEntry.cableType}
                  onChange={(e) => setEditedEntry({ ...editedEntry, cableType: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Couleur</label>
                <Select
                  value={editedEntry.cableColor}
                  onValueChange={(value) => setEditedEntry({ ...editedEntry, cableColor: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une couleur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rouge">Rouge</SelectItem>
                    <SelectItem value="Bleu">Bleu</SelectItem>
                    <SelectItem value="Vert">Vert</SelectItem>
                    <SelectItem value="Jaune">Jaune</SelectItem>
                    <SelectItem value="Noir">Noir</SelectItem>
                    <SelectItem value="Orange">Orange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Longueur</label>
                  <Input
                    type="number"
                    value={editedEntry.length}
                    onChange={(e) => setEditedEntry({ ...editedEntry, length: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Unité</label>
                  <Select
                    value={editedEntry.unit}
                    onValueChange={(value) => setEditedEntry({ ...editedEntry, unit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m">m</SelectItem>
                      <SelectItem value="mm">mm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={saveEdit}>Enregistrer</Button>
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
            <p>Êtes-vous sûr de vouloir supprimer cette entrée d'historique ?</p>
            {selectedEntry && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
                <p>
                  <strong>Date:</strong> {selectedEntry.date} {selectedEntry.time}
                </p>
                <p>
                  <strong>Utilisateur:</strong> {selectedEntry.user}
                </p>
                <p>
                  <strong>Projet:</strong> {selectedEntry.project}
                </p>
                <p>
                  <strong>Câble:</strong> {selectedEntry.cableType} ({selectedEntry.cableColor},{" "}
                  {selectedEntry.cableSize})
                </p>
                <p>
                  <strong>Longueur:</strong> {selectedEntry.length} {selectedEntry.unit}
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

      {/* Export Dialog */}
      <ExportDialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen} />
    </div>
  )
}
