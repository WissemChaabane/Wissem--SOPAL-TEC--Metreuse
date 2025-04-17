"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { BarChart2, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserSelector } from "@/components/user-selector"
import { ProjectSelector } from "@/components/project-selector"
import { LanguageSwitcher } from "@/components/language-switcher"
import { dataService, type User, type Project } from "@/lib/data-service"

export function WelcomeScreen() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedUser, setSelectedUser] = useState<string>("")
  const [selectedProject, setSelectedProject] = useState<string>("")

  // Load data on component mount
  useEffect(() => {
    dataService.initialize()
    setUsers(dataService.getUsers())
    setProjects(dataService.getProjects())
  }, [])

  const handleAddUser = (name: string) => {
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      createdAt: new Date().toISOString().split("T")[0],
      projectCount: 0,
    }
    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    dataService.saveUsers(updatedUsers)
    setSelectedUser(newUser.id)
  }

  const handleAddProject = (name: string) => {
    const newProject = {
      id: `project-${Date.now()}`,
      name,
      createdAt: new Date().toISOString().split("T")[0],
      userCount: 0,
      cableCount: 0,
    }
    const updatedProjects = [...projects, newProject]
    setProjects(updatedProjects)
    dataService.saveProjects(updatedProjects)
    setSelectedProject(newProject.id)
  }

  const handleContinue = () => {
    if (selectedUser && selectedProject) {
      // Save the selected user and project IDs to localStorage
      localStorage.setItem("selectedUserId", selectedUser)
      localStorage.setItem("selectedProjectId", selectedProject)
      router.push("/select-cable")
    }
  }

  const handleAdminClick = () => {
    router.push("/admin")
  }

  const handleDashboardClick = () => {
    router.push("/dashboard")
  }

  return (
    <div className="max-w-[480px] mx-auto min-h-screen bg-white">
      <div className="flex justify-end p-2">
        <LanguageSwitcher />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full">
          <div className="text-center mb-6">
            <Image
              src="/images/sopal-logo.png"
              alt="SOPAL TEC"
              width={160}
              height={56}
              className="mx-auto mb-4"
              priority
            />
            <h1 className="text-xl font-medium text-blue-500">Bienvenue sur métreuse de câble électrique</h1>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <UserSelector
              label="Utilisateur"
              users={users}
              selectedUser={selectedUser}
              onUserChange={setSelectedUser}
              onUserAdd={handleAddUser}
            />

            <ProjectSelector
              label="Projet"
              projects={projects}
              selectedProject={selectedProject}
              onProjectChange={setSelectedProject}
              onProjectAdd={handleAddProject}
            />

            <div className="space-y-4 mt-6">
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 py-6"
                disabled={!selectedUser || !selectedProject}
                onClick={handleContinue}
              >
                Continuer
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2 py-4"
                  onClick={handleDashboardClick}
                >
                  <BarChart2 className="h-5 w-5" />
                  <span>Tableau de Bord</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2 py-4"
                  onClick={handleAdminClick}
                >
                  <Settings className="h-5 w-5" />
                  <span>Administration</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
