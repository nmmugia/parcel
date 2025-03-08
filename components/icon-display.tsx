"use client"

import type { LightbulbIcon as LucideProps } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { cn } from "@/lib/utils"

interface IconDisplayProps extends LucideProps {
  icon: string
}

export function IconDisplay({ icon, className, ...props }: IconDisplayProps) {
  const Icon = LucideIcons[icon as keyof typeof LucideIcons] || LucideIcons.Package

  return <Icon className={cn("h-4 w-4", className)} {...props} />
}

