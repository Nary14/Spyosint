import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Globe, Database, Shield } from "lucide-react"
import { SkeletonCard } from "./skeleton-card"

const stats = [
  { label: "Enquêtes actives", value: 0, icon: Activity, trend: "+3" },
  { label: "Scans cette semaine", value: 0, icon: Globe, trend: "+12" },
  { label: "Sources analysées", value: 0, icon: Database, trend: "+28" },
  { label: "Alertes sécurité", value: 0, icon: Shield, trend: "-2" },
]

export default function StatsCards({ loading }: { loading: boolean }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {loading
        ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        : stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="bg-card border-border hover:border-primary/50 transition-colors group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
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
  )
}
