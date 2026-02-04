import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tableau de bord OSINT</h1>
        <p className="text-muted-foreground">Vue d'ensemble de vos enquêtes et analyses</p>
      </div>
      <div className="flex items-center gap-2">
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle mission
        </Button>
      </div>
    </div>
  )
}
