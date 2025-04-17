"use client"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ChevronLeft } from "lucide-react"
import { AnalysesDetailedPanel } from "@/components/analyses/analyses-detailed-panel"

interface AnalysesDetailedLayoutProps {
  onBack?: () => void
}

export function AnalysesDetailedLayout({ onBack }: AnalysesDetailedLayoutProps) {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.push("/dashboard")
    }
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
        <div className="w-10"></div> {/* Empty div for alignment */}
      </div>

      <div className="flex justify-center p-4 bg-white border-b">
        <h1 className="text-2xl font-medium text-blue-500">Analyses détaillées</h1>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <AnalysesDetailedPanel />
      </div>
    </div>
  )
}
