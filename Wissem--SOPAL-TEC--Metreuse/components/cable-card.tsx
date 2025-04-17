"use client"

interface CableCardProps {
  id: string
  name: string
  type: string
  color: string
  size: string
  isSelected?: boolean
  onClick: () => void
}

export function CableCard({ id, name, type, color, size, isSelected = false, onClick }: CableCardProps) {
  const colorMap: Record<string, string> = {
    Rouge: "bg-red-500",
    Bleu: "bg-blue-500",
    Orange: "bg-orange-400",
    Vert: "bg-green-500",
    Jaune: "bg-yellow-400",
    Noir: "bg-black",
  }

  const bgColorClass = colorMap[color] || "bg-gray-300"

  return (
    <div
      className={`p-4 border rounded-md mb-2 cursor-pointer transition-colors ${
        isSelected ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className={`w-6 h-6 rounded-full ${bgColorClass}`}></div>
        <div className="flex-1">
          <div className="font-medium">{name}</div>
          <div className={`text-sm ${isSelected ? "text-blue-100" : "text-gray-600"}`}>
            {type} | {color} | {size} | ID: {id}
          </div>
        </div>
      </div>
    </div>
  )
}
