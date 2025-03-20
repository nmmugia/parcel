"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ZoomIn, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ZoomableImageProps {
  src: string
  alt: string
  className?: string
  aspectRatio?: "auto" | "square" | "video"
  fallbackIcon?: React.ReactNode
}

export function ZoomableImage({ src, alt, className, aspectRatio = "video", fallbackIcon }: ZoomableImageProps) {
  const [isOpen, setIsOpen] = useState(false)

  const aspectRatioClass = {
    auto: "",
    square: "aspect-square",
    video: "aspect-video",
  }

  return (
    <>
      <div
        className={cn(
          "group relative cursor-pointer overflow-hidden rounded-md",
          aspectRatioClass[aspectRatio],
          className,
        )}
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`View ${alt} in full size`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setIsOpen(true)
          }
        }}
      >
        {src ? (
          <>
            <Image
              src={src || "/placeholder.svg"}
              alt={alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <ZoomIn className="h-8 w-8 text-white" />
            </div>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">{fallbackIcon}</div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl p-0 sm:p-0">
          <div className="relative h-[80vh] w-full">
            {src ? (
              <Image
                src={src || "/placeholder.svg"}
                alt={alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">{fallbackIcon}</div>
            )}
          </div>
          <button
            className="absolute right-4 top-4 rounded-full bg-background/80 p-2 text-foreground backdrop-blur-sm transition-colors hover:bg-background/60"
            onClick={() => setIsOpen(false)}
          >
            <span className="sr-only">Close</span>
          </button>
        </DialogContent>
      </Dialog>
    </>
  )
}

