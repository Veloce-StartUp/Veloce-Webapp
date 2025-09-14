import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { SplashCursor } from "@/components/ui/splash-cursor";

export const metadata: Metadata = {
  title: "Veloce",
  description: "Veloce",
  generator: "veloce-techbology.com",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
          <SplashCursor
              SPLAT_FORCE={1500}
              SPLAT_RADIUS={0.1}
              DISABLE_ON_INTERACTIVE={true}
          />
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
