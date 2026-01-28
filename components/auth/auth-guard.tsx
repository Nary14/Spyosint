"use client"

import React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Loader2, Shield } from "lucide-react"

const publicRoutes = ["/login", "/signup"]

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      if (!user && !publicRoutes.includes(pathname)) {
        router.push("/login")
      } else if (user && publicRoutes.includes(pathname)) {
        router.push("/")
      }
    }
  }, [user, loading, pathname, router])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 animate-pulse">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Chargement...</span>
        </div>
      </div>
    )
  }

  // Show login/signup pages without auth
  if (publicRoutes.includes(pathname)) {
    return <>{children}</>
  }

  // Show protected content only when authenticated
  if (user) {
    return <>{children}</>
  }

  // Return loading state while redirecting
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 animate-pulse">
        <Shield className="h-8 w-8 text-primary" />
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Redirection...</span>
      </div>
    </div>
  )
}
