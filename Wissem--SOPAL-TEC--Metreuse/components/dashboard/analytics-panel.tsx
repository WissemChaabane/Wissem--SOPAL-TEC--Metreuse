"use client"

import { useState, useEffect } from "react"
import { ArrowRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  dataService,
  type CutHistory,
  type Cable as CableType,
  type User as UserType,
  type Project,
} from "@/lib/data-service"
import { useRouter } from "next/navigation"

export function AnalyticsPanel() {
  const router = useRouter()
  const [history, setHistory] = useState<CutHistory[]>([])
  const [cables, setCables] = useState<CableType[]>([])
  const [users, setUsers] = useState<UserType[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  // Load data on component mount
  useEffect(() => {
    dataService.initialize()
    setHistory(dataService.getHistory())
    setCables(dataService.getCables())
    setUsers(dataService.getUsers())
    setProjects(dataService.getProjects())
  }, [])

  // Calculate total length cut
  const totalLength = history.reduce((sum, entry) => {
    const length = Number.parseFloat(entry.length)
    return sum + (isNaN(length) ? 0 : length)
  }, 0)

  // Find most used cable
  const cableUsage = history.reduce(
    (acc, entry) => {
      acc[entry.cableId] = (acc[entry.cableId] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const mostUsedCableId = Object.keys(cableUsage).reduce(
    (a, b) => (cableUsage[a] > cableUsage[b] ? a : b),
    Object.keys(cableUsage)[0] || "",
  )

  const mostUsedCable = cables.find((cable) => cable.id === mostUsedCableId)

  // Find most active user
  const userActivity = history.reduce(
    (acc, entry) => {
      acc[entry.user] = (acc[entry.user] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const mostActiveUser = Object.keys(userActivity).reduce(
    (a, b) => (userActivity[a] > userActivity[b] ? a : b),
    Object.keys(userActivity)[0] || "",
  )

  // Calculate cable distribution
  const cableDistribution = history.reduce(
    (acc, entry) => {
      const cableType = entry.cableType
      acc[cableType] = (acc[cableType] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const totalCuts = Object.values(cableDistribution).reduce((sum, count) => sum + count, 0)

  const cableDistributionPercentage = Object.entries(cableDistribution).map(([type, count]) => ({
    type,
    count,
    percentage: totalCuts > 0 ? Math.round((count / totalCuts) * 100) : 0,
    color: getCableColor(type),
  }))

  // Get color for cable type
  function getCableColor(cableType: string): string {
    const cable = cables.find((c) => c.name === cableType)
    if (!cable) return "bg-gray-400"

    switch (cable.color.toLowerCase()) {
      case "rouge":
        return "bg-red-500"
      case "bleu":
        return "bg-blue-500"
      case "orange":
        return "bg-orange-400"
      case "vert":
        return "bg-green-500"
      case "jaune":
        return "bg-yellow-400"
      case "noir":
        return "bg-black"
      default:
        return "bg-gray-400"
    }
  }

  const handleViewHistory = () => {
    router.push("/dashboard?panel=historique")
  }

  const handleViewAnalyses = () => {
    router.push("/analyses")
  }

  return (
    <div className="space-y-6">
      {/* Main Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Length */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardDescription>Longueur totale coupée</CardDescription>
            <CardTitle className="text-4xl text-blue-500 flex items-center">
              {totalLength.toFixed(1)} <span className="text-lg ml-1">m</span>
              <div className="ml-auto">
                <svg
                  className="h-6 w-6 text-blue-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 13.5H7L10 7L14 17L17 10.5L21 13.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Most Used Cable */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardDescription>Câble le plus utilisé</CardDescription>
            <CardTitle className="flex items-center">
              {mostUsedCable ? (
                <>
                  <div className={`w-3 h-3 rounded-full mr-2 ${getCableColor(mostUsedCable.name)}`}></div>
                  <div>
                    <div>{mostUsedCable.name}</div>
                    <div className="text-sm font-normal text-gray-500">
                      {mostUsedCable.type} | {mostUsedCable.size}
                    </div>
                  </div>
                  <div className="ml-auto">
                    <svg
                      className="h-6 w-6 text-blue-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22 12H18L15 19L9 5L6 12H2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </>
              ) : (
                "Aucun câble"
              )}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Most Active User */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardDescription>Utilisateur le plus actif</CardDescription>
            <CardTitle className="flex items-center">
              {mostActiveUser || "Aucun utilisateur"}
              <div className="ml-auto">
                <svg
                  className="h-6 w-6 text-blue-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Activity and Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {history.slice(0, 4).map((entry) => (
                <div key={entry.id} className="flex items-center p-4 border-b last:border-0">
                  <div
                    className={`w-8 h-8 rounded-full mr-4 flex items-center justify-center ${getCableColor(
                      entry.cableType,
                    )}`}
                  ></div>
                  <div className="flex-1">
                    <div className="font-medium">{entry.cableType}</div>
                    <div className="text-sm text-gray-500">
                      {entry.user} • Projet {entry.project}
                    </div>
                    <div className="text-sm text-gray-500">{entry.length} m</div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {entry.date} {entry.time}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 text-center">
              <Button variant="link" onClick={handleViewHistory} className="text-blue-500">
                Voir tout l'historique <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle>Résumé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Total utilisateurs</div>
                <div className="flex items-center mt-1">
                  <svg
                    className="h-4 w-4 mr-2 text-blue-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-xl font-bold">{users.length}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Total projets</div>
                <div className="flex items-center mt-1">
                  <svg
                    className="h-4 w-4 mr-2 text-blue-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 7H7V17H9V7Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 7H15V13H17V7Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-xl font-bold">{projects.length}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Total types de câbles</div>
                <div className="flex items-center mt-1">
                  <svg
                    className="h-4 w-4 mr-2 text-blue-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22 12H18L15 19L9 5L6 12H2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-xl font-bold">{cables.length}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Total coupes</div>
                <div className="flex items-center mt-1">
                  <svg
                    className="h-4 w-4 mr-2 text-blue-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 2V8H20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 13H8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 17H8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 9H9H8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-xl font-bold">{history.length}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-sm font-medium mb-2">Distribution des câbles</div>
              <div className="space-y-2">
                {cableDistributionPercentage.map((item) => (
                  <div key={item.type} className="flex items-center">
                    <div className="flex items-center w-32">
                      <div className={`w-3 h-3 rounded-full mr-2 ${item.color}`}></div>
                      <span className="text-sm">{item.type}</span>
                    </div>
                    <div className="flex-1 mx-2">
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                    <div className="w-10 text-right text-sm">{item.percentage}%</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <Button className="w-full bg-blue-500 hover:bg-blue-600" onClick={handleViewAnalyses}>
                Analyses détaillées <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
