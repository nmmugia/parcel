"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { IconDisplay } from "@/components/icon-display"
import { availableIcons } from "@/lib/icons"

interface IconPickerProps {
  value: string
  onChange: (value: string) => void
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          <div className="flex items-center gap-2">
            <IconDisplay icon={value} className="h-4 w-4" />
            <span>{value}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Cari icon..." />
          <CommandList>
            <CommandEmpty>Icon tidak ditemukan.</CommandEmpty>
            <CommandGroup>
              {availableIcons.map((icon) => (
                <CommandItem
                  key={icon}
                  value={icon}
                  onSelect={() => {
                    onChange(icon)
                    setOpen(false)
                  }}
                >
                  <div className="flex items-center gap-2">
                    <IconDisplay icon={icon} className="h-4 w-4" />
                    <span>{icon}</span>
                  </div>
                  <Check className={cn("ml-auto h-4 w-4", value === icon ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

