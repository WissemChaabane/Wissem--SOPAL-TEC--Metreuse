"use client"

import { useState, useEffect, useRef } from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { VirtualKeyboard } from "@/components/virtual-keyboard/virtual-keyboard"

interface FilteredSelectProps {
  options: { value: string; label: string }[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  emptyMessage?: string
  className?: string
  label?: string
}

export function FilteredSelect({
  options,
  value,
  onValueChange,
  placeholder = "Sélectionner...",
  emptyMessage = "Aucun résultat trouvé",
  className,
  label,
}: FilteredSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredOptions, setFilteredOptions] = useState(options)
  const [showKeyboard, setShowKeyboard] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedOption = options.find((option) => option.value === value)

  // Filter options when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredOptions(options)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = options.filter((option) => option.label.toLowerCase().includes(query))
      setFilteredOptions(filtered)
    }
  }, [searchQuery, options])

  // Focus input when popover opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    } else {
      setShowKeyboard(false)
    }
  }, [open])

  const handleKeyPress = (key: string) => {
    if (key === "backspace") {
      setSearchQuery(searchQuery.slice(0, -1))
    } else {
      setSearchQuery(searchQuery + key)
    }
  }

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between bg-white">
            {selectedOption ? selectedOption.label : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]" align="start">
          <Command>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                ref={inputRef}
                placeholder="Rechercher..."
                className="flex-1 border-0 focus:ring-0"
                value={searchQuery}
                onValueChange={setSearchQuery}
                onClick={() => setShowKeyboard(true)}
                readOnly
              />
            </div>
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      onValueChange(option.value)
                      setOpen(false)
                      setSearchQuery("")
                      setShowKeyboard(false)
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>

          {showKeyboard && (
            <div className="border-t">
              <VirtualKeyboard
                onKeyPress={handleKeyPress}
                onEnter={() => {
                  setShowKeyboard(false)
                  if (filteredOptions.length === 1) {
                    onValueChange(filteredOptions[0].value)
                    setOpen(false)
                    setSearchQuery("")
                  }
                }}
                onClose={() => setShowKeyboard(false)}
                keyboardType="text"
                position="inline"
                className="relative border-none shadow-none"
              />
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
