"use client"

import { useState, useRef, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FilteredSelect } from "@/components/filtered-select"
import { Input } from "@/components/ui/input"
import { VirtualKeyboard } from "@/components/virtual-keyboard/virtual-keyboard"

interface Project {
  id: string
  name: string
}

interface ProjectSelectorProps {
  label: string
  projects: Project[]
  selectedProject?: string
  onProjectChange: (projectId: string) => void
  onProjectAdd: (name: string) => void
}

export function ProjectSelector({
  label,
  projects,
  selectedProject,
  onProjectChange,
  onProjectAdd,
}: ProjectSelectorProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [showKeyboard, setShowKeyboard] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!isAddDialogOpen) {
      setShowKeyboard(false)
      setNewProjectName("")
    }
  }, [isAddDialogOpen])

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      onProjectAdd(newProjectName)
      setNewProjectName("")
      setIsAddDialogOpen(false)
      setShowKeyboard(false)
    }
  }

  const handleKeyPress = (key: string) => {
    if (key === "backspace") {
      setNewProjectName(newProjectName.slice(0, -1))
    } else {
      setNewProjectName(newProjectName + key)
    }
  }

  const projectOptions = projects.map((project) => ({
    value: project.id,
    label: project.name,
  }))

  return (
    <div className="mb-4">
      <div className="flex gap-2">
        <FilteredSelect
          label={label}
          options={projectOptions}
          value={selectedProject || ""}
          onValueChange={onProjectChange}
          placeholder="Sélectionner un projet"
          className="flex-1"
        />
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 border-gray-300 self-end"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Dialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open)
          if (!open) {
            setShowKeyboard(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un projet</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium mb-1">Nom du projet</label>
            <Input
              ref={inputRef}
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Entrez une valeur"
              className="w-full"
              onClick={() => setShowKeyboard(true)}
              readOnly // Make it read-only to prevent mobile keyboard
            />
          </div>
          <DialogFooter className="flex sm:justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false)
                setShowKeyboard(false)
              }}
            >
              Annuler
            </Button>
            <Button onClick={handleAddProject}>Ajouter</Button>
          </DialogFooter>

          {/* Keyboard inside the dialog */}
          {showKeyboard && (
            <div className="mt-4">
              <VirtualKeyboard
                onKeyPress={handleKeyPress}
                onEnter={handleAddProject}
                onClose={() => setShowKeyboard(false)}
                keyboardType="text"
                position="bottom"
                className="relative bottom-0 shadow-none border-t"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
