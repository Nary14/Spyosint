import React from "react"

export default function WelcomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // On utilise un Fragment <> ou une simple <div>
    // car le <html> et le <body> sont déjà fournis par app/layout.tsx
    <div className="min-h-screen">
      {children}
    </div>
  )
}