"use client"

import { useRouter } from "next/navigation" // <- ajouté
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Clock, ArrowRight, Globe, User, ImageIcon, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SkeletonList } from "./skeleton-card"
import { supabase } from "@/lib/supabaseClient"

interface Investigation {
  id: number
  title: string
  type: string
  status: "completed" | "in-progress" | "pending"
  date: string
  results: number
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "scan-sites": return Globe
    case "reverse-image": return ImageIcon
    case "social": return User
    case "correlation": return Search
    default: return Search
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

export default function RecentInvestigations() {
  const router = useRouter() // <- on initialise le router
  const [loading, setLoading] = useState(true)
  const [investigations, setInvestigations] = useState<Investigation[]>([])

  const fetchInvestigations = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("investigations")
      .select("*")
      .order("date", { ascending: false })

    if (error) {
      console.error("Erreur Supabase:", error)
      setInvestigations([])
    } else {
      setInvestigations(data as Investigation[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchInvestigations()
  }, [])

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Enquêtes récentes</CardTitle>
            <CardDescription className="text-muted-foreground">
              Vos dernières missions d'investigation
            </CardDescription>
          </div>
          {/* bouton Voir tout */}
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/80 hover:bg-secondary"
            onClick={() => router.push("/investigations")} // <- redirige vers la page
          >
            Voir tout
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <SkeletonList count={4} />
        ) : investigations.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">
            Aucune enquête pour le moment
          </p>
        ) : (
          <div className="space-y-3">
            {investigations.map((investigation) => {
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
                    <p className="font-medium text-foreground truncate">{investigation.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(investigation.date).toLocaleDateString()}</span>
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
  )
}
