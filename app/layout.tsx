import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Système d\'authentification Supabase',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="dark">
      <body className="font-sans antialiased bg-slate-950 text-slate-50">
        {children}
        <Analytics />

        {/* Chargement optimisé du moteur Spline */}
        <Script
          src="https://unpkg.com/@splinetool/viewer@1.12.73/build/spline-viewer.js"
          type="module"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}