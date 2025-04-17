// Types for our data
export interface User {
  id: string
  name: string
  createdAt: string
  projectCount: number
}

export interface Project {
  id: string
  name: string
  createdAt: string
  userCount: number
  cableCount: number
}

export interface Cable {
  id: string
  name: string
  type: string
  color: string
  size: string
  usageCount: number
}

export interface CutHistory {
  id: string
  date: string
  time: string
  user: string
  project: string
  cableType: string
  cableColor: string
  cableSize: string
  cableId: string
  length: string
  unit: string
}

// Initial data
const initialUsers: User[] = [
  { id: "1", name: "Marie Martin", createdAt: "2025-03-15", projectCount: 3 },
  { id: "2", name: "testu", createdAt: "2025-04-01", projectCount: 1 },
  { id: "3", name: "Jean Dupont", createdAt: "2025-04-10", projectCount: 0 },
]

const initialProjects: Project[] = [
  { id: "1", name: "Projet A", createdAt: "2025-03-20", userCount: 2, cableCount: 5 },
  { id: "2", name: "test", createdAt: "2025-04-05", userCount: 1, cableCount: 2 },
  { id: "3", name: "Projet B", createdAt: "2025-04-12", userCount: 0, cableCount: 0 },
]

const initialCables: Cable[] = [
  {
    id: "E001",
    name: "Câble secteur",
    type: "Électrique",
    color: "Rouge",
    size: "2.5mm²",
    usageCount: 12,
  },
  {
    id: "R001",
    name: "Ethernet Cat6",
    type: "Réseau",
    color: "Bleu",
    size: "0.5mm²",
    usageCount: 8,
  },
  {
    id: "O001",
    name: "IT",
    type: "rr",
    color: "Orange",
    size: "0.5mm²",
    usageCount: 3,
  },
]

const initialHistory: CutHistory[] = [
  {
    id: "1",
    date: "10/04/2025",
    time: "11:30",
    user: "Jean Dupont",
    project: "Projet A",
    cableType: "Câble secteur",
    cableColor: "Rouge",
    cableSize: "2.5mm²",
    cableId: "E001",
    length: "5.2",
    unit: "m",
  },
  {
    id: "2",
    date: "11/04/2025",
    time: "15:15",
    user: "Marie Martin",
    project: "Projet B",
    cableType: "Ethernet Cat6",
    cableColor: "Bleu",
    cableSize: "0.5mm²",
    cableId: "R001",
    length: "3.7",
    unit: "m",
  },
  {
    id: "3",
    date: "12/04/2025",
    time: "10:45",
    user: "Jean Dupont",
    project: "Projet B",
    cableType: "Câble secteur",
    cableColor: "Rouge",
    cableSize: "2.5mm²",
    cableId: "E001",
    length: "2.5",
    unit: "m",
  },
  {
    id: "4",
    date: "13/04/2025",
    time: "17:20",
    user: "Marie Martin",
    project: "Projet A",
    cableType: "IT",
    cableColor: "Orange",
    cableSize: "0.5mm²",
    cableId: "O001",
    length: "10",
    unit: "m",
  },
]

// Data service
class DataService {
  // Initialize data if it doesn't exist in localStorage
  initialize() {
    if (typeof window === "undefined") return

    if (!localStorage.getItem("sopal_users")) {
      localStorage.setItem("sopal_users", JSON.stringify(initialUsers))
    }

    if (!localStorage.getItem("sopal_projects")) {
      localStorage.setItem("sopal_projects", JSON.stringify(initialProjects))
    }

    if (!localStorage.getItem("sopal_cables")) {
      localStorage.setItem("sopal_cables", JSON.stringify(initialCables))
    }

    if (!localStorage.getItem("sopal_history")) {
      localStorage.setItem("sopal_history", JSON.stringify(initialHistory))
    }
  }

  // Users
  getUsers(): User[] {
    if (typeof window === "undefined") return initialUsers

    const users = localStorage.getItem("sopal_users")
    return users ? JSON.parse(users) : initialUsers
  }

  saveUsers(users: User[]) {
    if (typeof window === "undefined") return
    localStorage.setItem("sopal_users", JSON.stringify(users))
  }

  // Projects
  getProjects(): Project[] {
    if (typeof window === "undefined") return initialProjects

    const projects = localStorage.getItem("sopal_projects")
    return projects ? JSON.parse(projects) : initialProjects
  }

  saveProjects(projects: Project[]) {
    if (typeof window === "undefined") return
    localStorage.setItem("sopal_projects", JSON.stringify(projects))
  }

  // Cables
  getCables(): Cable[] {
    if (typeof window === "undefined") return initialCables

    const cables = localStorage.getItem("sopal_cables")
    return cables ? JSON.parse(cables) : initialCables
  }

  saveCables(cables: Cable[]) {
    if (typeof window === "undefined") return
    localStorage.setItem("sopal_cables", JSON.stringify(cables))
  }

  // History
  getHistory(): CutHistory[] {
    if (typeof window === "undefined") return initialHistory

    const history = localStorage.getItem("sopal_history")
    return history ? JSON.parse(history) : initialHistory
  }

  saveHistory(history: CutHistory[]) {
    if (typeof window === "undefined") return
    localStorage.setItem("sopal_history", JSON.stringify(history))
  }

  // Add a new cut to history
  addCut(cut: Omit<CutHistory, "id">) {
    const history = this.getHistory()
    const newCut = {
      ...cut,
      id: `cut-${Date.now()}`,
    }

    history.unshift(newCut) // Add to the beginning of the array
    this.saveHistory(history)

    // Update cable usage count
    const cables = this.getCables()
    const cableIndex = cables.findIndex((c) => c.id === cut.cableId)

    if (cableIndex !== -1) {
      cables[cableIndex].usageCount += 1
      this.saveCables(cables)
    }

    // Update project cable count
    const projects = this.getProjects()
    const projectIndex = projects.findIndex((p) => p.name === cut.project)

    if (projectIndex !== -1) {
      projects[projectIndex].cableCount += 1
      this.saveProjects(projects)
    }

    // Update user project count if this is their first time using this project
    const users = this.getUsers()
    const userIndex = users.findIndex((u) => u.name === cut.user)

    if (userIndex !== -1) {
      const userHistory = history.filter((h) => h.user === cut.user)
      const userProjects = new Set(userHistory.map((h) => h.project))

      if (userProjects.size > users[userIndex].projectCount) {
        users[userIndex].projectCount = userProjects.size
        this.saveUsers(users)
      }
    }

    return newCut
  }

  // Get analytics data
  getAnalytics() {
    const history = this.getHistory()
    const cables = this.getCables()
    const users = this.getUsers()
    const projects = this.getProjects()

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

    return {
      totalLength,
      mostUsedCable,
      mostActiveUser,
      cableDistribution,
      totalCuts: history.length,
      totalUsers: users.length,
      totalProjects: projects.length,
      totalCableTypes: cables.length,
    }
  }
}

export const dataService = new DataService()
