"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  dataService,
  type CutHistory,
  type Cable as CableType,
  type User as UserType,
  type Project,
} from "@/lib/data-service"
import { Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

export function AnalysesDetailedPanel() {
  const [history, setHistory] = useState<CutHistory[]>([])
  const [cables, setCables] = useState<CableType[]>([])
  const [users, setUsers] = useState<UserType[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [period, setPeriod] = useState("week")
  const [selectedProject, setSelectedProject] = useState("all")
  const [selectedCable, setSelectedCable] = useState("all")
  const [activeTab, setActiveTab] = useState("monthly")

  // Load data on component mount
  useEffect(() => {
    dataService.initialize()
    setHistory(dataService.getHistory())
    setCables(dataService.getCables())
    setUsers(dataService.getUsers())
    setProjects(dataService.getProjects())
  }, [])

  // Filter history based on selected period
  const filteredHistory = history
    .filter((entry) => {
      const entryDate = parseDate(entry.date)
      const now = new Date()

      switch (period) {
        case "today":
          return isSameDay(entryDate, now)
        case "week":
          return isWithinLastDays(entryDate, now, 7)
        case "month":
          return isWithinLastDays(entryDate, now, 30)
        case "year":
          return isWithinLastDays(entryDate, now, 365)
        default:
          return true
      }
    })
    .filter((entry) => {
      // Filter by project if selected
      if (selectedProject !== "all") {
        return entry.project === selectedProject
      }
      return true
    })
    .filter((entry) => {
      // Filter by cable if selected
      if (selectedCable !== "all") {
        return entry.cableId === selectedCable
      }
      return true
    })

  // Helper functions for date filtering
  function parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split("/").map(Number)
    return new Date(year, month - 1, day)
  }

  function isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  function isWithinLastDays(date: Date, now: Date, days: number): boolean {
    const diffTime = now.getTime() - date.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)
    return diffDays <= days
  }

  // Calculate total length cut
  const totalLength = filteredHistory.reduce((sum, entry) => {
    const length = Number.parseFloat(entry.length)
    return sum + (isNaN(length) ? 0 : length)
  }, 0)

  // Calculate monthly consumption data from actual history
  const monthlyConsumptionData = () => {
    const months = ["oct.", "nov.", "déc.", "janv.", "févr.", "mars", "avr."]
    const monthData = Array(7).fill(0)

    // Map month names to their numeric values (0-based)
    const monthMap: Record<string, number> = {
      "10": 0, // October
      "11": 1, // November
      "12": 2, // December
      "01": 3, // January
      "02": 4, // February
      "03": 5, // March
      "04": 6, // April
    }

    filteredHistory.forEach((entry) => {
      const [day, month, year] = entry.date.split("/")
      if (month in monthMap) {
        const monthIndex = monthMap[month]
        const length = Number.parseFloat(entry.length)
        if (!isNaN(length)) {
          monthData[monthIndex] += length
        }
      }
    })

    return {
      labels: months,
      datasets: [
        {
          label: "Consommation (m)",
          data: monthData,
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.5)",
        },
      ],
    }
  }

  // Prepare chart data for cable usage
  const cableUsageData = () => {
    const cableDistribution = filteredHistory.reduce(
      (acc, entry) => {
        const cableType = entry.cableType
        acc[cableType] = (acc[cableType] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      labels: Object.keys(cableDistribution),
      datasets: [
        {
          label: "Utilisations",
          data: Object.values(cableDistribution),
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
          ],
          borderWidth: 1,
        },
      ],
    }
  }

  // Prepare chart data for project usage
  const projectUsageData = () => {
    const projectUsage = filteredHistory.reduce(
      (acc, entry) => {
        acc[entry.project] = (acc[entry.project] || 0) + Number.parseFloat(entry.length)
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      labels: Object.keys(projectUsage),
      datasets: [
        {
          label: "Longueur totale (m)",
          data: Object.values(projectUsage),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    }
  }

  // Calculate efficiency (example calculation)
  const efficiency = 94.5 // This would be calculated based on actual metrics

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium mb-1 block">Période</label>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
              <SelectItem value="all">Tout</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Filtrer par projet</label>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les projets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les projets</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.name}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Filtrer par câble</label>
          <Select value={selectedCable} onValueChange={setSelectedCable}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les câbles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les câbles</SelectItem>
              {cables.map((cable) => (
                <SelectItem key={cable.id} value={cable.id}>
                  {cable.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="p-4">
            <CardDescription>Consommation totale</CardDescription>
            <CardTitle className="text-3xl flex items-center">
              {totalLength.toFixed(1)} <span className="text-lg ml-1">m</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4">
            <CardDescription>Total coupes</CardDescription>
            <CardTitle className="text-3xl">{filteredHistory.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4">
            <CardDescription>Efficacité</CardDescription>
            <CardTitle className="text-3xl text-green-500">{efficiency}%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4">
            <CardDescription>Pourcentage de perte</CardDescription>
            <CardTitle className="text-3xl text-red-500">0.0%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="monthly">Analyse mensuelle</TabsTrigger>
          <TabsTrigger value="cable">Utilisation des câbles</TabsTrigger>
          <TabsTrigger value="project">Utilisation par projet</TabsTrigger>
        </TabsList>
        <TabsContent value="monthly" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Consommation mensuelle de câble</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Line
                  data={monthlyConsumptionData()}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: "Mètres",
                        },
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cable" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Utilisation des câbles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Bar
                  data={cableUsageData()}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: "Nombre d'utilisations",
                        },
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="project" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Utilisation par projet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Bar
                  data={projectUsageData()}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: "Longueur totale (m)",
                        },
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
