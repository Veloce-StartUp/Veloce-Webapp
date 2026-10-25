"use client"

import type { ReactNode } from "react"
import { Footer } from "@/components/footer"

interface LegalPageLayoutProps {
  title: string
  lastUpdated: string
  children: ReactNode
}

export function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pt-32 pb-24 relative z-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-12 text-center">
            <h1 data-split className="text-4xl md:text-6xl font-semibold tracking-tight text-white mb-4">
              {title}
            </h1>
            <p data-reveal className="text-gray-400 text-sm">Last updated: {lastUpdated}</p>
          </div>

          <div data-reveal className="glass rounded-[2rem] p-6 md:p-12 space-y-10">
            {children}
          </div>
        </div>
      </div>
      <Footer />
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
      <div className="text-gray-200 leading-relaxed space-y-4 [&_a]:text-green-400 [&_a]:hover:text-green-300 [&_a]:transition-colors [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:text-gray-200">
        {children}
      </div>
    </section>
  )
}
