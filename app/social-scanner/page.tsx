"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SkeletonList } from "@/components/dashboard/skeleton-card"
import { ResultModal } from "@/components/dashboard/result-modal"
import {
  User,
  Search,
  Loader2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertCircle,
  AtSign,
} from "lucide-react"

const platforms = [
  { id: "twitter", name: "Twitter/X", color: "bg-[#1DA1F2]" },
  { id: "facebook", name: "Facebook", color: "bg-[#4267B2]" },
  { id: "instagram", name: "Instagram", color: "bg-[#E4405F]" },
  { id: "linkedin", name: "LinkedIn", color: "bg-[#0A66C2]" },
]

type PlatformStatus = "found" | "not_found" | "private" | "checking"

interface PlatformResult {
  platform: string
  status: PlatformStatus
  url?: string
  displayName?: string
  followers?: number
  posts?: number
  bio?: string
  joinDate?: string
  verified?: boolean
}

// Mock results
const getMockResults = (username: string): PlatformResult[] => [
  {
    platform: "Twitter/X",
    status: "found",
    url: `https://twitter.com/${username}`,
    displayName: username.charAt(0).toUpperCase() + username.slice(1),
    followers: 12500,
    posts: 847,
    bio: "Digital investigator | OSINT enthusiast | Cybersecurity",
    joinDate: "2019-03",
    verified: false,
  },
  {
    platform: "Facebook",
    status: "private",
    url: `https://facebook.com/${username}`,
    displayName: username.charAt(0).toUpperCase() + username.slice(1),
  },
  {
    platform: "Instagram",
    status: "found",
    url: `https://instagram.com/${username}`,
    displayName: username.charAt(0).toUpperCase() + username.slice(1),
    followers: 3420,
    posts: 156,
    bio: "Photographer | Tech lover",
    verified: true,
  },
  {
    platform: "LinkedIn",
    status: "not_found",
  },
]

const getStatusIcon = (status: PlatformStatus) => {
  switch (status) {
    case "found":
      return <CheckCircle2 className="h-5 w-5 text-success" />
    case "not_found":
      return <XCircle className="h-5 w-5 text-destructive" />
    case "private":
      return <AlertCircle className="h-5 w-5 text-warning" />
    case "checking":
      return <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
    default:
      return null
  }
}

const getStatusBadge = (status: PlatformStatus) => {
  switch (status) {
    case "found":
      return <Badge className="bg-success/20 text-success border-success/30">Trouvé</Badge>
    case "not_found":
      return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Non trouvé</Badge>
    case "private":
      return <Badge className="bg-warning/20 text-warning border-warning/30">Privé</Badge>
    case "checking":
      return <Badge className="bg-muted text-muted-foreground border-border">Vérification...</Badge>
    default:
      return null
  }
}

export default function SocialScannerPage() {
  const [username, setUsername] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    platforms.map((p) => p.id)
  )
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<PlatformResult[] | null>(null)
  const [selectedResult, setSelectedResult] = useState<PlatformResult | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const handleSearch = async () => {
    if (!username || selectedPlatforms.length === 0) return

    setLoading(true)
    setResults(null)

    // Simulate progressive search
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockResults = getMockResults(username).filter((r) =>
      selectedPlatforms.some(
        (p) => platforms.find((pl) => pl.id === p)?.name === r.platform
      )
    )

    setResults(mockResults)
    setLoading(false)
  }

  const openResultDetail = (result: PlatformResult) => {
    setSelectedResult(result)
    setModalOpen(true)
  }

  const formatNumber = (num?: number) => {
    if (!num) return "N/A"
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Social Scanner</h1>
          <p className="text-muted-foreground">
            Recherchez des profils sur plusieurs réseaux sociaux
          </p>
        </div>

        {/* Search Card */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recherche de profil</CardTitle>
            <CardDescription className="text-muted-foreground">
              Entrez un nom d&apos;utilisateur et sélectionnez les plateformes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Username Input */}
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Nom d'utilisateur (sans @)"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace("@", ""))}
                className="pl-10 bg-input border-border text-foreground"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            {/* Platform Chips */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Plateformes</p>
              <div className="flex flex-wrap gap-2">
                {platforms.map((platform) => {
                  const isSelected = selectedPlatforms.includes(platform.id)
                  return (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => togglePlatform(platform.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        isSelected
                          ? "bg-primary/20 text-primary border border-primary/50"
                          : "bg-secondary text-muted-foreground border border-border hover:border-primary/30"
                      }`}
                    >
                      <div className={`h-2 w-2 rounded-full ${platform.color}`} />
                      {platform.name}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Search Button */}
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={!username || selectedPlatforms.length === 0 || loading}
              onClick={handleSearch}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Recherche en cours...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher @{username || "username"}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Résultats</CardTitle>
            <CardDescription className="text-muted-foreground">
              {results
                ? `${results.filter((r) => r.status === "found").length} profils trouvés sur ${results.length} plateformes`
                : "Aucune recherche effectuée"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <SkeletonList count={4} />
            ) : results ? (
              <div className="space-y-3">
                {results.map((result) => (
                  <div
                    key={result.platform}
                    onClick={() => result.status !== "not_found" && openResultDetail(result)}
                    className={`p-4 rounded-lg border border-border transition-colors ${
                      result.status !== "not_found"
                        ? "bg-secondary/30 hover:bg-secondary/50 cursor-pointer group"
                        : "bg-muted/20 opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Status Icon */}
                      <div className="shrink-0 mt-1">{getStatusIcon(result.status)}</div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">
                            {result.platform}
                          </span>
                          {getStatusBadge(result.status)}
                          {result.verified && (
                            <Badge className="bg-chart-1/20 text-chart-1 border-chart-1/30">
                              Vérifié
                            </Badge>
                          )}
                        </div>

                        {result.status === "found" && (
                          <>
                            <p className="text-sm text-muted-foreground mb-2">
                              {result.bio || "Pas de bio"}
                            </p>
                            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                              <span>
                                <strong className="text-foreground">
                                  {formatNumber(result.followers)}
                                </strong>{" "}
                                followers
                              </span>
                              <span>
                                <strong className="text-foreground">
                                  {formatNumber(result.posts)}
                                </strong>{" "}
                                posts
                              </span>
                              {result.joinDate && (
                                <span>
                                  Inscrit en{" "}
                                  <strong className="text-foreground">{result.joinDate}</strong>
                                </span>
                              )}
                            </div>
                          </>
                        )}

                        {result.status === "private" && (
                          <p className="text-sm text-muted-foreground">
                            Profil existe mais est privé ou restreint
                          </p>
                        )}

                        {result.status === "not_found" && (
                          <p className="text-sm text-muted-foreground">
                            Aucun profil trouvé avec ce nom d&apos;utilisateur
                          </p>
                        )}
                      </div>

                      {/* External Link */}
                      {result.url && result.status !== "not_found" && (
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <User className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Entrez un nom d&apos;utilisateur pour commencer la recherche
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Result Modal */}
        <ResultModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          title={selectedResult ? `Profil ${selectedResult.platform}` : "Profil"}
          description={selectedResult?.displayName}
          data={selectedResult}
          sourceUrl={selectedResult?.url}
        />
      </div>
    </DashboardLayout>
  )
}
