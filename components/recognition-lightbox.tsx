"use client"

import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import type { Recognition } from "@/components/recognition-section"

interface RecognitionLightboxProps {
  item: Recognition
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RecognitionLightbox({ item, open, onOpenChange }: RecognitionLightboxProps) {
  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="glass-strong gap-0 overflow-hidden rounded-3xl border-white/10 bg-black/70 p-0 text-white sm:max-w-5xl [&>button]:rounded-full [&>button]:bg-black/60 [&>button]:p-2 [&>button]:text-white [&>button]:opacity-100 [&>button]:hover:bg-green-600">
          <div className="relative aspect-[3/2] max-h-[75vh] w-full bg-black">
            <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-contain"
            />
          </div>
          <div className="border-t border-white/[0.08] p-4 md:p-6">
            <DialogTitle className="text-lg text-white md:text-xl">
              {item.title} <span className="text-green-400">· {item.event}</span>
            </DialogTitle>
            <DialogDescription className="mt-2 text-gray-300">Awarded by {item.organizer}</DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
  )
}
