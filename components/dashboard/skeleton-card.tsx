import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function SkeletonCard() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-24 bg-muted" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-2 bg-muted" />
        <Skeleton className="h-3 w-32 bg-muted" />
      </CardContent>
    </Card>
  )
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
          <Skeleton className="h-10 w-10 rounded-lg bg-muted" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4 bg-muted" />
            <Skeleton className="h-3 w-1/2 bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="bg-card border-border overflow-hidden">
          <Skeleton className="h-32 w-full bg-muted" />
          <CardContent className="pt-4">
            <Skeleton className="h-4 w-3/4 mb-2 bg-muted" />
            <Skeleton className="h-3 w-1/2 bg-muted" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
