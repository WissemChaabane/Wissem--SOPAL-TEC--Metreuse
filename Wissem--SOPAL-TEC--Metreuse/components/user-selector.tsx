"use client"

import { useState, useRef, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FilteredSelect } from "@/components/filtered-select"
import { Input } from "@/components/ui/input"
import { VirtualKeyboard } from "@/components/virtual-keyboard/virtual-keyboard"

interface User {
  id: string
  name: string
}

interface UserSelectorProps {
  label: string
  users: User[]
  selectedUser?: string
  onUserChange: (userId: string) => void
  onUserAdd: (name: string) => void
}

export function UserSelector({ label, users, selectedUser, onUserChange, onUserAdd }: UserSelectorProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newUserName, setNewUserName] = useState("")
  const [showKeyboard, setShowKeyboard] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!isAddDialogOpen) {
      setShowKeyboard(false)
      setNewUserName("")
    }
  }, [isAddDialogOpen])

  const handleAddUser = () => {
    if (newUserName.trim()) {
      onUserAdd(newUserName)
      setNewUserName("")
      setIsAddDialogOpen(false)
      setShowKeyboard(false)
    }
  }

  const handleKeyPress = (key: string) => {
    if (key === "backspace") {
      setNewUserName(newUserName.slice(0, -1))
    } else {
      setNewUserName(newUserName + key)
    }
  }

  const userOptions = users.map((user) => ({
    value: user.id,
    label: user.name,
  }))

  return (
    <div className="mb-4">
      <div className="flex gap-2">
        <FilteredSelect
          label={label}
          options={userOptions}
          value={selectedUser || ""}
          onValueChange={onUserChange}
          placeholder="Sélectionner un utilisateur"
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
            <DialogTitle>Ajouter un utilisateur</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium mb-1">Nom de l'utilisateur</label>
            <Input
              ref={inputRef}
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
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
            <Button onClick={handleAddUser}>Ajouter</Button>
          </DialogFooter>

          {/* Keyboard inside the dialog */}
          {showKeyboard && (
            <div className="mt-4">
              <VirtualKeyboard
                onKeyPress={handleKeyPress}
                onEnter={handleAddUser}
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
