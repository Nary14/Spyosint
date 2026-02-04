import { Card, CardContent } from "@/components/ui/card"
import { ImageIcon, Globe, User, Search } from "lucide-react"
import Link from "next/link"

export default function QuickActions() {
  const actions = [
    { label: "Reverse Image Scan", icon: ImageIcon, href: "/reverse-image" },
    { label: "Website Footprint", icon: Globe, href: "/scan-sites" },
    { label: "Social Media Scan", icon: User, href: "/social-scanner" },
    { label: "IA Correlation", icon: Search, href: "/ia-correlation" },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action) => (
        <Link key={action.label} href={action.href}>
          <Card className="bg-card border-border hover:border-primary/50 hover:bg-secondary/50 transition-all cursor-pointer group h-full">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <action.icon className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">{action.label}</span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
