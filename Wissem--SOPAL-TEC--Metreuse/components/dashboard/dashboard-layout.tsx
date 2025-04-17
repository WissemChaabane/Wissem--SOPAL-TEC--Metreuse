"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ChevronLeft, BarChart2, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnalyticsPanel } from "@/components/dashboard/analytics-panel"
import { HistoryPanel } from "@/components/admin/history-panel"

interface DashboardLayoutProps {
  onBack?: () => void
  initialPanel?: string
}

export function DashboardLayout({ onBack, initialPanel = "analytics" }: DashboardLayoutProps) {
  const router = useRouter()
  const [activePanel, setActivePanel] = useState<string>(initialPanel)

  useEffect(() => {
    if (initialPanel) {
      setActivePanel(initialPanel)
    }
  }, [initialPanel])

  const renderPanel = () => {
    switch (activePanel) {
      case "analytics":
        return <AnalyticsPanel />
      case "historique":
        return <HistoryPanel />
      default:
        return <AnalyticsPanel />
    }
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.push("/")
    }
  }

  const handleAdminClick = () => {
    router.push("/admin")
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
        <Button variant="outline" size="icon" className="h-10 w-10" onClick={handleAdminClick}>
          <BarChart2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex justify-center p-4 bg-white border-b">
        <h1 className="text-2xl font-medium text-blue-500">Tableau de Bord</h1>
      </div>

      <div className="flex justify-center space-x-8 p-4 bg-white border-b">
        <button
          className={`flex items-center ${activePanel === "analytics" ? "text-blue-600" : "text-gray-600"}`}
          onClick={() => setActivePanel("analytics")}
        >
          <BarChart2 className="h-5 w-5 mr-2" />
          <span>Analytics</span>
        </button>
        <button
          className={`flex items-center ${activePanel === "historique" ? "text-blue-600" : "text-gray-600"}`}
          onClick={() => setActivePanel("historique")}
        >
          <History className="h-5 w-5 mr-2" />
          <span>Historique</span>
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">{renderPanel()}</div>
    </div>
  )
}
