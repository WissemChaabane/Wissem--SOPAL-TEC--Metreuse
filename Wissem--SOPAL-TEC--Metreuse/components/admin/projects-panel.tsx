"use client"

import { useState, useEffect } from "react"
import { Trash2, Edit, Search, FolderPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { VirtualKeyboard } from "@/components/virtual-keyboard/virtual-keyboard"
import { dataService, type Project } from "@/lib/data-service"

export function ProjectsPanel() {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [newProjectName, setNewProjectName] = useState("")
  const [editedProjectName, setEditedProjectName] = useState("")
  const [showDialogKeyboard, setShowDialogKeyboard] = useState(false)

  // Load projects on component mount
  useEffect(() => {
    dataService.initialize()
    setProjects(dataService.getProjects())
  }, [])

  const filteredProjects = projects.filter((project) => {
    if (!searchTerm) return true
    return project.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      const newProject = {
        id: `project-${Date.now()}`,
        name: newProjectName,
        createdAt: new Date().toISOString().split("T")[0],
        userCount: 0,
        cableCount: 0,
      }
      const updatedProjects = [...projects, newProject]
      setProjects(updatedProjects)
      dataService.saveProjects(updatedProjects)
      setNewProjectName("")
      setIsAddDialogOpen(false)
      setShowDialogKeyboard(false)
    }
  }

  const handleEdit = (project: Project) => {
    setSelectedProject(project)
    setEditedProjectName(project.name)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (project: Project) => {
    setSelectedProject(project)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedProject) {
      const updatedProjects = projects.filter((project) => project.id !== selectedProject.id)
      setProjects(updatedProjects)
      dataService.saveProjects(updatedProjects)
      setIsDeleteDialogOpen(false)
    }
  }

  const saveEdit = () => {
    if (selectedProject && editedProjectName.trim()) {
      const updatedProjects = projects.map((project) =>
        project.id === selectedProject.id ? { ...project, name: editedProjectName } : project,
      )
      setProjects(updatedProjects)
      dataService.saveProjects(updatedProjects)
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
    if (isAddDialogOpen) {
      if (key === "backspace") {
        setNewProjectName(newProjectName.slice(0, -1))
      } else {
        setNewProjectName(newProjectName + key)
      }
    } else if (isEditDialogOpen) {
      if (key === "backspace") {
        setEditedProjectName(editedProjectName.slice(0, -1))
      } else {
        setEditedProjectName(editedProjectName + key)
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Projets</h2>
        <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
          <FolderPlus className="h-4 w-4" />
          Ajouter un projet
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Rechercher un projet"
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
              <th className="text-left py-3 px-4 font-medium text-gray-500">Nom</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Date de création</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Utilisateurs</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Câbles</th>
              <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Aucun projet trouvé
                </td>
              </tr>
            ) : (
              filteredProjects.map((project) => (
                <tr key={project.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{project.name}</td>
                  <td className="py-3 px-4">{project.createdAt}</td>
                  <td className="py-3 px-4">{project.userCount}</td>
                  <td className="py-3 px-4">{project.cableCount}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEdit(project)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleDelete(project)}>
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

      {/* Add Project Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open)
          if (!open) {
            setNewProjectName("")
            setShowDialogKeyboard(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un projet</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium">Nom du projet</label>
            <Input
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Entrez le nom du projet"
              className="mt-1"
              onClick={() => setShowDialogKeyboard(true)}
              readOnly
            />
            {showDialogKeyboard && (
              <div className="mt-4">
                <VirtualKeyboard
                  onKeyPress={handleDialogKeyPress}
                  onEnter={handleAddProject}
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
            <Button onClick={handleAddProject} disabled={!newProjectName.trim()}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open)
          if (!open) {
            setEditedProjectName("")
            setShowDialogKeyboard(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier le projet</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium">Nom du projet</label>
            <Input
              value={editedProjectName}
              onChange={(e) => setEditedProjectName(e.target.value)}
              placeholder="Entrez le nom du projet"
              className="mt-1"
              onClick={() => setShowDialogKeyboard(true)}
              readOnly
            />
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
            <Button onClick={saveEdit} disabled={!editedProjectName.trim()}>
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
            <p>Êtes-vous sûr de vouloir supprimer ce projet ?</p>
            {selectedProject && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
                <p>
                  <strong>Nom:</strong> {selectedProject.name}
                </p>
                <p>
                  <strong>Date de création:</strong> {selectedProject.createdAt}
                </p>
                <p>
                  <strong>Utilisateurs:</strong> {selectedProject.userCount}
                </p>
                <p>
                  <strong>Câbles:</strong> {selectedProject.cableCount}
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
