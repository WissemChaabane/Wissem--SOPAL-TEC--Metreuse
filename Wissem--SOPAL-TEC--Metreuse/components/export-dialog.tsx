"use client"

import { useState } from "react"
import { Calendar, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { dataService, type CutHistory } from "@/lib/data-service"

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExportDialog({ open, onOpenChange }: ExportDialogProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [exportFormat, setExportFormat] = useState<string>("csv")
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  const handleExport = () => {
    // Get history data
    const historyData = dataService.getHistory()

    // Filter by date range if dates are selected
    let filteredData = historyData
    if (startDate || endDate) {
      filteredData = historyData.filter((entry) => {
        const entryDate = parseDate(entry.date)

        if (startDate && endDate) {
          return entryDate >= startDate && entryDate <= endDate
        } else if (startDate) {
          return entryDate >= startDate
        } else if (endDate) {
          return entryDate <= endDate
        }
        return true
      })
    }

    // Export based on selected format
    switch (exportFormat) {
      case "csv":
        exportAsCSV(filteredData)
        break
      case "json":
        exportAsJSON(filteredData)
        break
      case "text":
        exportAsText(filteredData)
        break
      case "pdf":
        alert("Export PDF n'est pas encore implémenté")
        break
      default:
        exportAsCSV(filteredData)
    }

    // Close dialog
    onOpenChange(false)
  }

  // Parse date from DD/MM/YYYY format
  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split("/").map(Number)
    return new Date(year, month - 1, day)
  }

  // Export as CSV
  const exportAsCSV = (data: CutHistory[]) => {
    const headers = [
      "Date",
      "Heure",
      "Utilisateur",
      "Projet",
      "Type de câble",
      "Couleur",
      "Taille",
      "ID",
      "Longueur",
      "Unité",
    ]
    const csvContent = [
      headers.join(","),
      ...data.map((entry) =>
        [
          entry.date,
          entry.time,
          `"${entry.user}"`,
          `"${entry.project}"`,
          `"${entry.cableType}"`,
          entry.cableColor,
          entry.cableSize,
          entry.cableId,
          entry.length,
          entry.unit,
        ].join(","),
      ),
    ].join("\n")

    downloadFile(csvContent, "historique_coupes.csv", "text/csv")
  }

  // Export as JSON
  const exportAsJSON = (data: CutHistory[]) => {
    const jsonContent = JSON.stringify(data, null, 2)
    downloadFile(jsonContent, "historique_coupes.json", "application/json")
  }

  // Export as plain text
  const exportAsText = (data: CutHistory[]) => {
    const textContent = data
      .map(
        (entry) =>
          `Date: ${entry.date} ${entry.time}, Utilisateur: ${entry.user}, Projet: ${entry.project}, ` +
          `Câble: ${entry.cableType} (${entry.cableColor}, ${entry.cableSize}), ` +
          `ID: ${entry.cableId}, Longueur: ${entry.length} ${entry.unit}`,
      )
      .join("\n\n")

    downloadFile(textContent, "historique_coupes.txt", "text/plain")
  }

  // Helper function to download file
  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exporter Historique</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-500 mb-6">
            Sélectionnez une période et un format pour exporter votre historique de coupes
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date de Début</label>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yyyy") : "Sélectionner Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date)
                      setStartDateOpen(false)
                    }}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date de Fin</label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd/MM/yyyy") : "Sélectionner Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      setEndDate(date)
                      setEndDateOpen(false)
                    }}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Format d'Export</label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="text">Texte</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleExport} className="bg-blue-800 hover:bg-blue-900">
            <Download className="mr-2 h-4 w-4" />
            Télécharger
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
