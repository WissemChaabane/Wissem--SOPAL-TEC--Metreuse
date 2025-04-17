"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface LanguageSwitcherProps {
  initialLanguage?: "FR" | "EN" | "AR"
}

export function LanguageSwitcher({ initialLanguage = "FR" }: LanguageSwitcherProps) {
  const [language, setLanguage] = useState<"FR" | "EN" | "AR">(initialLanguage)

  return (
    <div className="flex items-center space-x-1">
      <Button
        variant={language === "FR" ? "default" : "outline"}
        size="sm"
        className="h-8 w-10 px-0"
        onClick={() => setLanguage("FR")}
      >
        FR
      </Button>
      <Button
        variant={language === "EN" ? "default" : "outline"}
        size="sm"
        className="h-8 w-10 px-0"
        onClick={() => setLanguage("EN")}
      >
        EN
      </Button>
      <Button
        variant={language === "AR" ? "default" : "outline"}
        size="sm"
        className="h-8 w-10 px-0"
        onClick={() => setLanguage("AR")}
      >
        AR
      </Button>
    </div>
  )
}
