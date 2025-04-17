"use client"

import { useState, useEffect } from "react"
import { Trash2, Edit, Search, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { VirtualKeyboard } from "@/components/virtual-keyboard/virtual-keyboard"
import { dataService, type User } from "@/lib/data-service"

export function UsersPanel() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newUserName, setNewUserName] = useState("")
  const [editedUserName, setEditedUserName] = useState("")
  const [showDialogKeyboard, setShowDialogKeyboard] = useState(false)

  // Load users on component mount
  useEffect(() => {
    dataService.initialize()
    setUsers(dataService.getUsers())
  }, [])

  const filteredUsers = users.filter((user) => {
    if (!searchTerm) return true
    return user.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const handleAddUser = () => {
    if (newUserName.trim()) {
      const newUser = {
        id: `user-${Date.now()}`,
        name: newUserName,
        createdAt: new Date().toISOString().split("T")[0],
        projectCount: 0,
      }
      const updatedUsers = [...users, newUser]
      setUsers(updatedUsers)
      dataService.saveUsers(updatedUsers)
      setNewUserName("")
      setIsAddDialogOpen(false)
      setShowDialogKeyboard(false)
    }
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setEditedUserName(user.name)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (user: User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedUser) {
      const updatedUsers = users.filter((user) => user.id !== selectedUser.id)
      setUsers(updatedUsers)
      dataService.saveUsers(updatedUsers)
      setIsDeleteDialogOpen(false)
    }
  }

  const saveEdit = () => {
    if (selectedUser && editedUserName.trim()) {
      const updatedUsers = users.map((user) => (user.id === selectedUser.id ? { ...user, name: editedUserName } : user))
      setUsers(updatedUsers)
      dataService.saveUsers(updatedUsers)
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
        setNewUserName(newUserName.slice(0, -1))
      } else {
        setNewUserName(newUserName + key)
      }
    } else if (isEditDialogOpen) {
      if (key === "backspace") {
        setEditedUserName(editedUserName.slice(0, -1))
      } else {
        setEditedUserName(editedUserName + key)
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Utilisateurs</h2>
        <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Ajouter un utilisateur
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Rechercher un utilisateur"
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
              <th className="text-left py-3 px-4 font-medium text-gray-500">Projets</th>
              <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  Aucun utilisateur trouvé
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{user.name}</td>
                  <td className="py-3 px-4">{user.createdAt}</td>
                  <td className="py-3 px-4">{user.projectCount}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEdit(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleDelete(user)}>
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

      {/* Add User Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open)
          if (!open) {
            setNewUserName("")
            setShowDialogKeyboard(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un utilisateur</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium">Nom de l'utilisateur</label>
            <Input
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Entrez le nom de l'utilisateur"
              className="mt-1"
              onClick={() => setShowDialogKeyboard(true)}
              readOnly
            />
            {showDialogKeyboard && (
              <div className="mt-4">
                <VirtualKeyboard
                  onKeyPress={handleDialogKeyPress}
                  onEnter={handleAddUser}
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
            <Button onClick={handleAddUser} disabled={!newUserName.trim()}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open)
          if (!open) {
            setEditedUserName("")
            setShowDialogKeyboard(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium">Nom de l'utilisateur</label>
            <Input
              value={editedUserName}
              onChange={(e) => setEditedUserName(e.target.value)}
              placeholder="Entrez le nom de l'utilisateur"
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
            <Button onClick={saveEdit} disabled={!editedUserName.trim()}>
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
            <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
            {selectedUser && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
                <p>
                  <strong>Nom:</strong> {selectedUser.name}
                </p>
                <p>
                  <strong>Date de création:</strong> {selectedUser.createdAt}
                </p>
                <p>
                  <strong>Projets:</strong> {selectedUser.projectCount}
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
