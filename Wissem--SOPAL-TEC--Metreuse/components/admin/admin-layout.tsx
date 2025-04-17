"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ChevronLeft, History, Users, FolderKanban, Cable, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HistoryPanel } from "@/components/admin/history-panel"
import { UsersPanel } from "@/components/admin/users-panel"
import { ProjectsPanel } from "@/components/admin/projects-panel"
import { CablesPanel } from "@/components/admin/cables-panel"

interface AdminLayoutProps {
  onBack?: () => void
  initialTab?: string
}

export function AdminLayout({ onBack, initialTab = "history" }: AdminLayoutProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>(initialTab)

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])

  const renderPanel = () => {
    switch (activeTab) {
      case "history":
        return <HistoryPanel />
      case "users":
        return <UsersPanel />
      case "projects":
        return <ProjectsPanel />
      case "cables":
        return <CablesPanel />
      default:
        return <HistoryPanel />
    }
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.push("/")
    }
  }

  const handleDashboardClick = () => {
    router.push("/dashboard")
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex items-center justify-between p-4 bg-white">
        <button onClick={handleBack} className="text-gray-600">
          <ChevronLeft size={24} />
        </button>
        <div className="mx-auto">
          <Image src="/images/sopal-logo.png" alt="SOPAL TEC" width={100} height={35} priority />
        </div>
        <Button variant="outline" size="icon" className="h-10 w-10" onClick={handleDashboardClick}>
          <BarChart2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex justify-center p-4 bg-white border-b">
        <h1 className="text-2xl font-medium text-blue-500">Admin</h1>
      </div>

      <div className="flex justify-center space-x-8 p-4 bg-white border-b">
        <button
          className={`flex items-center ${activeTab === "history" ? "text-blue-600" : "text-gray-600"}`}
          onClick={() => setActiveTab("history")}
        >
          <History className="h-5 w-5 mr-2" />
          <span>Historique</span>
        </button>
        <button
          className={`flex items-center ${activeTab === "users" ? "text-blue-600" : "text-gray-600"}`}
          onClick={() => setActiveTab("users")}
        >
          <Users className="h-5 w-5 mr-2" />
          <span>Utilisateurs</span>
        </button>
        <button
          className={`flex items-center ${activeTab === "projects" ? "text-blue-600" : "text-gray-600"}`}
          onClick={() => setActiveTab("projects")}
        >
          <FolderKanban className="h-5 w-5 mr-2" />
          <span>Projets</span>
        </button>
        <button
          className={`flex items-center ${activeTab === "cables" ? "text-blue-600" : "text-gray-600"}`}
          onClick={() => setActiveTab("cables")}
        >
          <Cable className="h-5 w-5 mr-2" />
          <span>Câbles</span>
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">{renderPanel()}</div>
    </div>
  )
}
