"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SkeletonList } from "@/components/dashboard/skeleton-card"
import { ResultModal } from "@/components/dashboard/result-modal"
import {
  Globe,
  Search,
  Clock,
  Database,
  Server,
  Loader2,
  ExternalLink,
  Calendar,
  Shield,
} from "lucide-react"

const scanTools = [
  { id: "wayback", name: "Wayback Machine", icon: Clock, description: "Archives web historiques" },
  { id: "commoncrawl", name: "CommonCrawl", icon: Database, description: "Index web massif" },
  { id: "whois", name: "WHOIS", icon: Server, description: "Informations domaine" },
]

// Mock WHOIS data
const mockWhoisData = {
  domain: "example.com",
  registrar: "GoDaddy",
  creationDate: "1997-09-15",
  expirationDate: "2025-09-14",
  nameServers: ["ns1.example.com", "ns2.example.com"],
  registrant: {
    organization: "Example Inc.",
    country: "US",
    state: "California",
  },
  status: ["clientTransferProhibited"],
}

// Mock Wayback data
const mockWaybackData = {
  url: "example.com",
  snapshots: 15420,
  firstCapture: "2001-01-15",
  lastCapture: "2024-01-28",
  captures: [
    { date: "2024-01-28", status: 200, mime: "text/html" },
    { date: "2024-01-15", status: 200, mime: "text/html" },
    { date: "2023-12-20", status: 200, mime: "text/html" },
    { date: "2023-11-05", status: 301, mime: "text/html" },
    { date: "2023-10-10", status: 200, mime: "text/html" },
  ],
}

// Mock CommonCrawl data
const mockCommonCrawlData = {
  url: "example.com",
  records: 8542,
  crawls: ["CC-MAIN-2024-04", "CC-MAIN-2023-50", "CC-MAIN-2023-40"],
  mimeTypes: {
    "text/html": 7250,
    "application/json": 842,
    "text/css": 350,
    "application/javascript": 100,
  },
  languages: ["en", "fr", "es"],
}

export default function ScanSitesPage() {
  const [url, setUrl] = useState("")
  const [activeTab, setActiveTab] = useState("wayback")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Record<string, unknown> | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleScan = async (toolId: string) => {
    if (!url) return

    setLoading(true)
    setActiveTab(toolId)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    switch (toolId) {
      case "wayback":
        setResults(mockWaybackData)
        break
      case "commoncrawl":
        setResults(mockCommonCrawlData)
        break
      case "whois":
        setResults(mockWhoisData)
        break
      default:
        setResults(null)
    }

    setLoading(false)
  }

  const handleScanAll = async () => {
    if (!url) return

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setResults({
      wayback: mockWaybackData,
      commonCrawl: mockCommonCrawlData,
      whois: mockWhoisData,
    })
    setLoading(false)
  }

  const isValidUrl = url.length > 0

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Scan Sites</h1>
          <p className="text-muted-foreground">
            Analysez les domaines avec Wayback Machine, CommonCrawl et WHOIS
          </p>
        </div>

        {/* URL Input */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Entrez une URL ou un domaine (ex: example.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-10 bg-input border-border text-foreground"
                />
              </div>
              <div className="flex gap-2">
                {scanTools.map((tool) => (
                  <Button
                    key={tool.id}
                    variant="outline"
                    size="sm"
                    disabled={!isValidUrl || loading}
                    onClick={() => handleScan(tool.id)}
                    className="border-border bg-transparent hover:bg-secondary hidden sm:flex"
                  >
                    <tool.icon className="h-4 w-4 mr-1" />
                    {tool.name}
                  </Button>
                ))}
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={!isValidUrl || loading}
                  onClick={handleScanAll}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Scanner
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Mobile tool buttons */}
            <div className="flex gap-2 mt-3 sm:hidden">
              {scanTools.map((tool) => (
                <Button
                  key={tool.id}
                  variant="outline"
                  size="sm"
                  disabled={!isValidUrl || loading}
                  onClick={() => handleScan(tool.id)}
                  className="flex-1 border-border bg-transparent hover:bg-secondary"
                >
                  <tool.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-secondary border border-border">
            {scanTools.map((tool) => (
              <TabsTrigger
                key={tool.id}
                value={tool.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <tool.icon className="h-4 w-4 mr-2" />
                {tool.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Wayback Machine Tab */}
          <TabsContent value="wayback">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Wayback Machine
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Historique des captures web
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <SkeletonList count={5} />
                ) : results && "snapshots" in results ? (
                  <div className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                        <p className="text-sm text-muted-foreground">Total captures</p>
                        <p className="text-2xl font-bold text-foreground">
                          {(results as typeof mockWaybackData).snapshots.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                        <p className="text-sm text-muted-foreground">Première capture</p>
                        <p className="text-lg font-semibold text-foreground">
                          {(results as typeof mockWaybackData).firstCapture}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                        <p className="text-sm text-muted-foreground">Dernière capture</p>
                        <p className="text-lg font-semibold text-foreground">
                          {(results as typeof mockWaybackData).lastCapture}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                        <p className="text-sm text-muted-foreground">URL</p>
                        <p className="text-lg font-semibold text-foreground truncate">
                          {(results as typeof mockWaybackData).url}
                        </p>
                      </div>
                    </div>

                    {/* Recent captures */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Captures récentes</p>
                      {(results as typeof mockWaybackData).captures.map((capture, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer group border border-border"
                        >
                          <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{capture.date}</span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded ${
                                capture.status === 200
                                  ? "bg-success/20 text-success"
                                  : "bg-warning/20 text-warning"
                              }`}
                            >
                              {capture.status}
                            </span>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setModalOpen(true)}
                      className="w-full border-border bg-transparent hover:bg-secondary"
                    >
                      Voir les données complètes
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Entrez une URL pour voir l&apos;historique</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* CommonCrawl Tab */}
          <TabsContent value="commoncrawl">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  CommonCrawl
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Index web et métadonnées
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <SkeletonList count={4} />
                ) : results && "records" in results ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                        <p className="text-sm text-muted-foreground">Enregistrements</p>
                        <p className="text-2xl font-bold text-foreground">
                          {(results as typeof mockCommonCrawlData).records.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                        <p className="text-sm text-muted-foreground">Crawls</p>
                        <p className="text-2xl font-bold text-foreground">
                          {(results as typeof mockCommonCrawlData).crawls.length}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                        <p className="text-sm text-muted-foreground">Langues</p>
                        <p className="text-2xl font-bold text-foreground">
                          {(results as typeof mockCommonCrawlData).languages.join(", ")}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Types MIME</p>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(
                          (results as typeof mockCommonCrawlData).mimeTypes
                        ).map(([mime, count]) => (
                          <div
                            key={mime}
                            className="flex justify-between p-2 rounded bg-secondary/30 border border-border"
                          >
                            <span className="text-sm text-muted-foreground font-mono">{mime}</span>
                            <span className="text-sm text-foreground font-medium">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setModalOpen(true)}
                      className="w-full border-border bg-transparent hover:bg-secondary"
                    >
                      Voir les données complètes
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <Database className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Entrez une URL pour explorer l&apos;index</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* WHOIS Tab */}
          <TabsContent value="whois">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  WHOIS
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Informations d&apos;enregistrement du domaine
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <SkeletonList count={6} />
                ) : results && "registrar" in results ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Domaine</p>
                          <p className="text-foreground font-medium">
                            {(results as typeof mockWhoisData).domain}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Registrar</p>
                          <p className="text-foreground font-medium">
                            {(results as typeof mockWhoisData).registrar}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Date de création</p>
                          <p className="text-foreground font-medium">
                            {(results as typeof mockWhoisData).creationDate}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Date d&apos;expiration</p>
                          <p className="text-foreground font-medium">
                            {(results as typeof mockWhoisData).expirationDate}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Organisation</p>
                          <p className="text-foreground font-medium">
                            {(results as typeof mockWhoisData).registrant.organization}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Pays</p>
                          <p className="text-foreground font-medium">
                            {(results as typeof mockWhoisData).registrant.country}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Serveurs DNS</p>
                          <div className="flex flex-wrap gap-1">
                            {(results as typeof mockWhoisData).nameServers.map((ns) => (
                              <span
                                key={ns}
                                className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground font-mono"
                              >
                                {ns}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Statut</p>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-success" />
                            <span className="text-sm text-foreground">
                              {(results as typeof mockWhoisData).status[0]}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setModalOpen(true)}
                      className="w-full border-border bg-transparent hover:bg-secondary"
                    >
                      Voir les données complètes
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <Server className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Entrez un domaine pour voir les infos WHOIS</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Result Modal */}
        <ResultModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          title="Données complètes"
          description={url}
          data={results}
        />
      </div>
    </DashboardLayout>
  )
}
