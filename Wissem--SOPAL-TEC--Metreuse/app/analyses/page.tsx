"use client"
import { useRouter } from "next/navigation"
import { AnalysesDetailedLayout } from "@/components/analyses/analyses-detailed-layout"

export default function AnalysesPage() {
  const router = useRouter()

  const handleBack = () => {
    router.push("/dashboard")
  }

  return <AnalysesDetailedLayout onBack={handleBack} />
}
