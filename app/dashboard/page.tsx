"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
// Import des composants de ton projet
import StatsCards from "@/components/dashboard/StatsCards"
import QuickActions from "@/components/dashboard/QuickActions"
// Import des composants UI (Shadcn)
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SkeletonList } from "@/components/dashboard/skeleton-card"
// Import des icônes
import { Clock, Globe, User, ImageIcon, Search as SearchIcon, ArrowRight } from "lucide-react"
// Client Supabase
import { supabase } from "@/lib/supabaseClient"

// --- TYPES & HELPERS ---
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
        case "correlation": return SearchIcon
        default: return SearchIcon
    }
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case "completed":
            return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Terminé</Badge>
        case "in-progress":
            return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">En cours</Badge>
        default:
            return <Badge variant="outline" className="text-muted-foreground">En attente</Badge>
    }
}

export default function HomePage() {
    const [loading, setLoading] = useState(true)
    const [investigations, setInvestigations] = useState<Investigation[]>([])

    useEffect(() => {
        const fetchInvestigations = async () => {
            setLoading(true)
            try {
                const { data, error } = await supabase
                    .from("investigations")
                    .select("*")
                    .order("date", { ascending: false })
                    .limit(5)

                if (!error && data) setInvestigations(data as Investigation[])
            } catch (e) {
                console.error("Erreur de récupération:", e)
            } finally {
                setLoading(false)
            }
        }
        fetchInvestigations()
    }, [])

    return (
        <div className="flex flex-col gap-10 w-full max-w-full">
            {/* TITRE PRINCIPAL */}
            <div className="flex flex-col gap-1 w-full">
                <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
                    Tableau de <span className="text-emerald-500">Bord</span>
                </h1>
            </div>

            {/* SECTION 1 : STATS (Pleine largeur) */}
            <section className="w-full">
                <StatsCards loading={false} />
            </section>

            {/* SECTION 2 : ACTIONS RAPIDES (Pleine largeur) */}
            <section className="w-full">
                <QuickActions />
            </section>

            {/* SECTION 3 : INVESTIGATIONS (Pleine largeur) */}
            <section className="w-full pb-10">
                <Card className="bg-neutral-900/40 border-emerald-500/10 backdrop-blur-sm w-full">
                    <CardHeader className="border-b border-emerald-500/5 flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle className="text-xl uppercase tracking-tight">Dernières Enquêtes</CardTitle>
                            <CardDescription className="text-emerald-500/50 text-xs">Historique des logs système</CardDescription>
                        </div>
                        <Link href="/investigations">
                            <Button variant="ghost" className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 gap-2">
                                Voir tout <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {loading ? (
                            <SkeletonList count={4} />
                        ) : investigations.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-emerald-500/5 rounded-xl">
                                <p className="text-muted-foreground font-mono text-sm italic">Aucune donnée trouvée.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {investigations.map((inv) => {
                                    const Icon = getTypeIcon(inv.type)
                                    return (
                                        <div
                                            key={inv.id}
                                            className="flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-emerald-500/5 hover:border-emerald-500/20 hover:bg-black/60 transition-all group w-full"
                                        >
                                            <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20">
                                                <Icon className="h-6 w-6 text-emerald-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-white truncate text-lg">{inv.title}</p>
                                                <div className="flex items-center gap-4 text-[10px] text-emerald-500/50 font-mono uppercase tracking-tighter">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {new Date(inv.date).toLocaleDateString()}
                                                    </span>
                                                    <span>{inv.results} Résultats</span>
                                                </div>
                                            </div>
                                            <div className="shrink-0 flex items-center gap-4">
                                                {getStatusBadge(inv.status)}
                                                <ArrowRight className="h-5 w-5 text-emerald-500/20 group-hover:text-emerald-500 transition-colors hidden sm:block" />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>
        </div>
    )
}