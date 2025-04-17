"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { VirtualKeyboard } from "@/components/virtual-keyboard/virtual-keyboard"
import { cn } from "@/lib/utils"

interface KeyboardInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  type?: "text" | "numeric" | "email"
  onEnter?: () => void
  label?: string
  autoShowKeyboard?: boolean
}

export function KeyboardInput({
  value,
  onChange,
  placeholder,
  className,
  type = "text",
  onEnter,
  label,
  autoShowKeyboard = false,
}: KeyboardInputProps) {
  const [showKeyboard, setShowKeyboard] = useState(autoShowKeyboard)
  const [keyboardPosition, setKeyboardPosition] = useState<"top" | "bottom">("bottom")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyPress = (key: string) => {
    if (key === "backspace") {
      onChange(value.slice(0, -1))
    } else if (type === "numeric" && key === ".") {
      // Only add decimal point if there isn't one already
      if (!value.includes(".")) {
        onChange(value + key)
      }
    } else {
      onChange(value + key)
    }
  }

  const handleEnter = () => {
    setShowKeyboard(false)
    if (onEnter) {
      onEnter()
    }
  }

  const handleFocus = () => {
    // Only show keyboard on explicit click, not on auto-focus
    if (!autoShowKeyboard) {
      // Calculate if there's enough space below the input
      if (inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom

        // If less than 300px below, show keyboard at top
        if (spaceBelow < 300) {
          setKeyboardPosition("top")
        } else {
          setKeyboardPosition("bottom")
        }
      }
      setShowKeyboard(true)
    }
  }

  // Adjust scroll when keyboard opens
  useEffect(() => {
    if (showKeyboard && inputRef.current && keyboardPosition === "bottom") {
      const rect = inputRef.current.getBoundingClientRect()
      const isInputVisible = rect.top >= 0 && rect.bottom <= window.innerHeight

      if (!isInputVisible) {
        inputRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [showKeyboard, keyboardPosition])

  return (
    <div className={cn("relative", className)}>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <Input
        ref={inputRef}
        type={type === "numeric" ? "text" : "text"} // Use text for numeric to prevent mobile keyboard
        inputMode={type === "numeric" ? "decimal" : "text"}
        value={value}
        onChange={(e) => {
          if (type === "numeric") {
            // Only allow numbers and a single decimal point
            if (/^[0-9]*\.?[0-9]*$/.test(e.target.value) || e.target.value === "") {
              onChange(e.target.value)
            }
          } else {
            onChange(e.target.value)
          }
        }}
        onClick={handleFocus} // Only show keyboard on explicit click
        placeholder={placeholder}
        className="w-full"
        readOnly={type !== "numeric"} // Make non-numeric inputs read-only to prevent mobile keyboard
      />
      {showKeyboard && (
        <VirtualKeyboard
          onKeyPress={handleKeyPress}
          onEnter={handleEnter}
          onClose={() => setShowKeyboard(false)}
          keyboardType={type}
          position={keyboardPosition}
        />
      )}
    </div>
  )
}
