import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { SplashCursor } from "@/components/ui/splash-cursor";

export const metadata: Metadata = {
    title: {
        default: "Veloce - Innovative Software Solutions for Modern Businesses",
        template: "%s | Veloce"
    },
    description: "Veloce designs and develops cutting-edge software solutions that empower businesses to grow, scale, and lead the future. Custom web applications, mobile apps, and enterprise solutions.",
    keywords: ["software development", "web applications", "mobile apps", "enterprise solutions", "custom software", "technology consulting"],
    authors: [{ name: "Veloce Technology" }],
    creator: "Veloce Technology",
    publisher: "Veloce Technology",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://veloce-technology.com'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: "Veloce - Innovative Software Solutions for Modern Businesses",
        description: "Veloce designs and develops cutting-edge software solutions that empower businesses to grow, scale, and lead the future.",
        url: 'https://veloce-technology.com',
        siteName: 'Veloce',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Veloce - Innovative Software Solutions',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Veloce - Innovative Software Solutions for Modern Businesses',
        description: 'Veloce designs and develops cutting-edge software solutions that empower businesses to grow, scale, and lead the future.',
        images: ['/twitter-image.jpg'],
        creator: '@velocetech',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'zMWdK_ukoSAwnhEDE6aipp8ZBKV5-AtpJihzZc8T83I',
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.webmanifest',
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
        <head>
            <meta name="theme-color" content="#000000" />
        </head>
        <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning={true}>
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