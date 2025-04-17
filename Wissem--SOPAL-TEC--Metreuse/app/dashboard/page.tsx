"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export default function Dashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const panel = searchParams.get("panel")

  const handleBack = () => {
    router.back()
  }

  return <DashboardLayout onBack={handleBack} initialPanel={panel || "analytics"} />
}
