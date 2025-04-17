"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("history")

  const handleBack = () => {
    router.push("/")
  }

  return <AdminLayout onBack={handleBack} initialTab={activeTab} />
}
