"use client"

import type { ReactNode } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { InteractiveBackground } from "@/components/interactive-background"
import { ScrollToTop } from "@/components/scroll-to-top"

interface LegalPageLayoutProps {
  title: string
  lastUpdated: string
  children: ReactNode
}

export function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      <InteractiveBackground />
      <Navigation />
      <div className="pt-32 pb-24 relative z-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {title}
            </h1>
            <p className="text-gray-500 text-sm">Last updated: {lastUpdated}</p>
          </div>

          <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 md:p-12 space-y-10">
            {children}
          </div>
        </div>
      </div>
      <Footer />
      <ScrollToTop />
    </main>
  )
}

export function LegalSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-green-400">{title}</h2>
      <div className="text-gray-300 leading-relaxed space-y-4 [&_a]:text-green-400 [&_a]:hover:text-green-300 [&_a]:transition-colors [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:text-gray-300">
        {children}
      </div>
    </section>
  )
}
