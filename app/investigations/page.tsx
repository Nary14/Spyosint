"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Clock, Globe, User, ImageIcon, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabaseClient"
import { SkeletonList } from "@/components/dashboard/skeleton-card"
import Link from "next/link"

interface Investigation {
    id: string;
    title: string;
    type: string;
    status: "completed" | "in-progress" | "pending";
    created_at: string;
    results: number;
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

export default function InvestigationsPage() {
    const [loading, setLoading] = useState(true)
    const [investigations, setInvestigations] = useState<Investigation[]>([])

    const fetchInvestigations = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from("investigations")
            .select("*")
            .order("created_at", { ascending: false }) // Correction du nom de la colonne ici

        if (error) {
            console.error("Détails Supabase:", error.message, error.details, error.hint);
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
        <div className="p-4 md:p-6 lg:p-8">
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle>Toutes les enquêtes</CardTitle>
                    <CardDescription>Liste complète de vos investigations</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <SkeletonList count={6} />
                    ) : investigations.length === 0 ? (
                        <p className="text-center text-muted-foreground py-6">
                            Aucune enquête pour le moment
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {investigations.map((inv) => {
                                const Icon = getTypeIcon(inv.type)
                                return (
                                    <Link 
                                        href={`/investigations/${inv.id}`} 
                                        key={inv.id} 
                                        className="block w-full group"
                                >
                                        <div className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 hover:bg-emerald-500/5 transition-all cursor-pointer border border-transparent hover:border-emerald-500/20 shadow-sm hover:shadow-emerald-500/5">
                                            {/* Icône */}
                                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                                                <Icon className="h-5 w-5 text-primary group-hover:text-emerald-500" />
                                            </div>

                                            {/* Texte */}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-foreground truncate group-hover:text-white transition-colors">
                                                    {inv.title}
                                                </p>
                                                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-tighter text-muted-foreground group-hover:text-emerald-500/50">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{new Date(inv.created_at).toLocaleDateString()}</span>
                                                    <span className="opacity-30">•</span>
                                                    <span>{inv.results} résultats identifiés</span>
                                                </div>
                                            </div>

                                            {/* Status Badge */}
                                            <div className="shrink-0 flex items-center gap-3">
                                                {getStatusBadge(inv.status)}
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
