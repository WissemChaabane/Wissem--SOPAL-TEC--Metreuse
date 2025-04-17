"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { SkipBackIcon as Backspace, ArrowRight, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void
  onEnter: () => void
  onClose: () => void
  keyboardType?: "text" | "numeric" | "email"
  position?: "bottom" | "top" | "inline"
  className?: string
}

export function VirtualKeyboard({
  onKeyPress,
  onEnter,
  onClose,
  keyboardType = "text",
  position = "bottom",
  className,
}: VirtualKeyboardProps) {
  const [shift, setShift] = useState(false)
  const keyboardRef = useRef<HTMLDivElement>(null)

  // Define keyboard layouts
  const numericKeys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [".", "0", "<"],
  ]

  const textKeys = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "°", "+"],
    ["a", "z", "e", "r", "t", "y", "u", "i", "o", "p", "^", "$"],
    ["q", "s", "d", "f", "g", "h", "j", "k", "l", "m", "ù", "*"],
    ["↑", "w", "x", "c", "v", "b", "n", ",", ";", ":", "!", "⌫"],
  ]

  const emailKeys = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "@", "."],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "-", "_"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ".", "com", "/"],
    ["↑", "z", "x", "c", "v", "b", "n", "m", "@gmail", "@yahoo", "@hotmail", "⌫"],
  ]

  const handleKeyPress = (key: string) => {
    if (key === "↑") {
      setShift(!shift)
      return
    }

    if (key === "⌫") {
      onKeyPress("backspace")
      return
    }

    if (key === "<") {
      onKeyPress("backspace")
      return
    }

    if (key === "space") {
      onKeyPress(" ")
      return
    }

    let pressedKey = key
    if (shift && key.length === 1) {
      pressedKey = key.toUpperCase()
    }

    onKeyPress(pressedKey)
  }

  // Close keyboard when clicking outside - only for fixed position keyboards
  useEffect(() => {
    if (position !== "inline") {
      const handleClickOutside = (event: MouseEvent) => {
        if (keyboardRef.current && !keyboardRef.current.contains(event.target as Node)) {
          onClose()
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [onClose, position])

  const getKeyboardLayout = () => {
    switch (keyboardType) {
      case "numeric":
        return numericKeys
      case "email":
        return emailKeys
      default:
        return textKeys
    }
  }

  const positionClass =
    position === "inline"
      ? ""
      : position === "bottom"
        ? "fixed bottom-0 left-0 right-0"
        : "fixed top-[56px] left-0 right-0"

  return (
    <div
      ref={keyboardRef}
      className={cn(
        "bg-white border-t shadow-lg z-50 transition-all duration-300 ease-in-out",
        positionClass,
        className,
      )}
    >
      <div className="flex justify-end p-1">
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 rounded-full">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-1 max-w-md mx-auto">
        <div className="grid grid-cols-12 gap-1">
          {getKeyboardLayout().map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((key, keyIndex) => (
                <Button
                  key={`${rowIndex}-${keyIndex}`}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-10 rounded-md text-sm font-medium bg-gray-50 hover:bg-gray-100",
                    key === "⌫" && "col-span-2",
                    key.startsWith("@") && "col-span-3 text-xs",
                    key === "com" && "col-span-2 text-xs",
                  )}
                  onClick={() => handleKeyPress(key)}
                >
                  {key === "⌫" ? (
                    <Backspace className="h-4 w-4" />
                  ) : shift && key.length === 1 ? (
                    key.toUpperCase()
                  ) : (
                    key
                  )}
                </Button>
              ))}
            </React.Fragment>
          ))}
        </div>

        {/* Space bar and enter button */}
        <div className="grid grid-cols-12 gap-1 mt-1">
          <Button
            variant="outline"
            className="col-span-8 h-10 bg-gray-50 hover:bg-gray-100"
            onClick={() => handleKeyPress("space")}
          >
            Espace
          </Button>
          <Button
            className="col-span-4 h-10 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => {
              onClose() // Close the keyboard first
              onEnter() // Then trigger the enter action
            }}
          >
            Entrée
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
