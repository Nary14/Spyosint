"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SkeletonCard, SkeletonList } from "@/components/dashboard/skeleton-card"
import { ApiKeysModal } from "@/components/dashboard/api-keys-modal"
import {
  Plus,
  Search,
  Globe,
  User,
  ImageIcon,
  Clock,
  ArrowRight,
  Activity,
  Shield,
  Database,
} from "lucide-react"
import Link from "next/link"

// Mock data for recent investigations
const recentInvestigations = [
  {
    id: 1,
    title: "Analyse domaine suspect",
    type: "scan-sites",
    status: "completed",
    date: "2024-01-28",
    results: 12,
  },
  {
    id: 2,
    title: "Recherche image inversée",
    type: "reverse-image",
    status: "in-progress",
    date: "2024-01-27",
    results: 5,
  },
  {
    id: 3,
    title: "Profil social @target_user",
    type: "social",
    status: "completed",
    date: "2024-01-26",
    results: 23,
  },
  {
    id: 4,
    title: "Corrélation multi-sources",
    type: "correlation",
    status: "pending",
    date: "2024-01-25",
    results: 0,
  },
]

const stats = [
  { label: "Enquêtes actives", value: 12, icon: Activity, trend: "+3" },
  { label: "Scans cette semaine", value: 47, icon: Globe, trend: "+12" },
  { label: "Sources analysées", value: 156, icon: Database, trend: "+28" },
  { label: "Alertes sécurité", value: 3, icon: Shield, trend: "-2" },
]

const getTypeIcon = (type: string) => {
  switch (type) {
    case "scan-sites":
      return Globe
    case "reverse-image":
      return ImageIcon
    case "social":
      return User
    case "correlation":
      return Search
    default:
      return Search
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-success/20 text-success border-success/30 hover:bg-success/30">Terminé</Badge>
    case "in-progress":
      return <Badge className="bg-warning/20 text-warning border-warning/30 hover:bg-warning/30">En cours</Badge>
    case "pending":
      return <Badge className="bg-muted text-muted-foreground border-border hover:bg-muted/80">En attente</Badge>
    default:
      return null
  }
}

export default function HomePage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
            <p className="text-muted-foreground">
              Vue d&apos;ensemble de vos enquêtes OSINT
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ApiKeysModal />
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle mission
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <Card
                    key={stat.label}
                    className="bg-card border-border hover:border-primary/50 transition-colors group"
                  >
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.label}
                      </CardTitle>
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        <span className={stat.trend.startsWith("+") ? "text-success" : "text-destructive"}>
                          {stat.trend}
                        </span>{" "}
                        depuis la semaine dernière
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/reverse-image">
            <Card className="bg-card border-border hover:border-primary/50 hover:bg-secondary/50 transition-all cursor-pointer group h-full">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <ImageIcon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">Reverse Image</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/scan-sites">
            <Card className="bg-card border-border hover:border-primary/50 hover:bg-secondary/50 transition-all cursor-pointer group h-full">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">Scan Sites</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/social-scanner">
            <Card className="bg-card border-border hover:border-primary/50 hover:bg-secondary/50 transition-all cursor-pointer group h-full">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">Social Scanner</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/ia-correlation">
            <Card className="bg-card border-border hover:border-primary/50 hover:bg-secondary/50 transition-all cursor-pointer group h-full">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">IA Corrélation</span>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Investigations */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Enquêtes récentes</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Vos dernières missions d&apos;investigation
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-secondary">
                Voir tout
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <SkeletonList count={4} />
            ) : (
              <div className="space-y-3">
                {recentInvestigations.map((investigation) => {
                  const Icon = getTypeIcon(investigation.type)
                  return (
                    <div
                      key={investigation.id}
                      className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer group"
                    >
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {investigation.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{investigation.date}</span>
                          <span className="text-border">•</span>
                          <span>{investigation.results} résultats</span>
                        </div>
                      </div>
                      {getStatusBadge(investigation.status)}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
