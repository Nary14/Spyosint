"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { SkeletonList } from "@/components/dashboard/skeleton-card"
import { ResultModal } from "@/components/dashboard/result-modal"
import { ApiKeysModal, useApiKey } from "@/components/dashboard/api-keys-modal"
import {
  Shield,
  Search,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Server,
  Globe,
  Mail,
  Lock,
  ExternalLink,
} from "lucide-react"

// Mock VirusTotal data
const mockVirusTotalData = {
  url: "example.com",
  scanDate: "2024-01-28",
  stats: {
    harmless: 68,
    malicious: 0,
    suspicious: 2,
    undetected: 10,
  },
  engines: [
    { name: "Google Safebrowsing", result: "clean", category: "harmless" },
    { name: "Kaspersky", result: "clean", category: "harmless" },
    { name: "BitDefender", result: "clean", category: "harmless" },
    { name: "ESET", result: "suspicious", category: "suspicious" },
    { name: "Avira", result: "clean", category: "harmless" },
  ],
  categories: {
    "Information Technology": 45,
    Business: 12,
    Shopping: 3,
  },
}

// Mock Shodan data
const mockShodanData = {
  ip: "93.184.216.34",
  hostnames: ["example.com"],
  country: "United States",
  city: "Los Angeles",
  org: "Edgecast Inc.",
  isp: "Verizon Digital Media Services",
  ports: [80, 443],
  vulns: [],
  lastUpdate: "2024-01-28",
  services: [
    { port: 80, protocol: "http", product: "ECS", version: "2.0" },
    { port: 443, protocol: "https", product: "ECS", version: "2.0" },
  ],
}

// Mock DNSDumpster data
const mockDNSDumpsterData = {
  domain: "example.com",
  records: {
    A: [{ host: "example.com", ip: "93.184.216.34", asn: "AS15133" }],
    MX: [{ host: "mail.example.com", priority: 10 }],
    TXT: ["v=spf1 include:_spf.example.com ~all"],
    NS: ["ns1.example.com", "ns2.example.com"],
  },
  subdomains: [
    { host: "www.example.com", ip: "93.184.216.34" },
    { host: "mail.example.com", ip: "93.184.216.35" },
    { host: "api.example.com", ip: "93.184.216.36" },
    { host: "cdn.example.com", ip: "93.184.216.37" },
  ],
}

// Mock theHarvester data
const mockHarvesterData = {
  domain: "example.com",
  emails: [
    "admin@example.com",
    "info@example.com",
    "support@example.com",
    "contact@example.com",
  ],
  hosts: ["example.com", "www.example.com", "mail.example.com", "api.example.com"],
  ips: ["93.184.216.34", "93.184.216.35"],
  sources: ["bing", "google", "linkedin", "twitter"],
}

const tools = [
  { id: "virustotal", name: "VirusTotal", icon: Shield, requiresKey: true },
  { id: "shodan", name: "Shodan", icon: Server, requiresKey: true },
  { id: "dnsdumpster", name: "DNSDumpster", icon: Globe, requiresKey: false },
  { id: "harvester", name: "theHarvester", icon: Mail, requiresKey: false },
]

export default function OutilsProPage() {
  const [activeTab, setActiveTab] = useState("virustotal")
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Record<string, unknown> | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const vtKey = useApiKey("virustotal")
  const shodanKey = useApiKey("shodan")

  const handleSearch = async (toolId: string) => {
    if (!query) return

    setLoading(true)
    setActiveTab(toolId)

    try {
      if (toolId === "virustotal") {
        // Determine the type of query
        let type = "domain"
        if (query.match(/^https?:\/\//)) {
          type = "url"
        } else if (query.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
          type = "ip"
        } else if (query.match(/^[a-fA-F0-9]{32,64}$/)) {
          type = "hash"
        }

        const response = await fetch("/api/virustotal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, value: query }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "VirusTotal API error")
        }

        const data = await response.json()
        setResults({
          ...data,
          url: query,
          scanDate: data.lastAnalysisDate || new Date().toISOString().split("T")[0],
          engines: data.detections?.map((d: { engine: string; result?: string; category: string }) => ({
            name: d.engine,
            result: d.result || d.category,
            category: d.category,
          })) || [],
        })
      } else if (toolId === "shodan") {
        // Determine the type of query for Shodan
        let type = "ip"
        if (query.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
          type = "ip"
        } else if (query.match(/^[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}$/)) {
          type = "domain"
        } else {
          type = "search"
        }

        const response = await fetch("/api/shodan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, value: query }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Shodan API error")
        }

        const data = await response.json()
        setResults(data)
      } else if (toolId === "dnsdumpster") {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setResults(mockDNSDumpsterData)
      } else if (toolId === "harvester") {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setResults(mockHarvesterData)
      } else {
        setResults(null)
      }
    } catch (error) {
      console.error("Search error:", error)
      setResults({ error: error instanceof Error ? error.message : "Une erreur est survenue" })
    }

    setLoading(false)
  }

  const getToolStatus = (toolId: string) => {
    if (toolId === "virustotal") return vtKey ? "configured" : "needs_key"
    if (toolId === "shodan") return shodanKey ? "configured" : "needs_key"
    return "available"
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Outils PRO</h1>
            <p className="text-muted-foreground">
              Outils avancés d&apos;analyse de sécurité et de reconnaissance
            </p>
          </div>
          <ApiKeysModal />
        </div>

        {/* Search Input */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="URL, IP, domaine ou hash..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 bg-input border-border text-foreground"
                />
              </div>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!query || loading}
                onClick={() => handleSearch(activeTab)}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Analyser
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tools Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-secondary border border-border w-full flex-wrap h-auto p-1 gap-1">
            {tools.map((tool) => {
              const status = getToolStatus(tool.id)
              return (
                <TabsTrigger
                  key={tool.id}
                  value={tool.id}
                  className="flex-1 min-w-[120px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <tool.icon className="h-4 w-4 mr-2" />
                  {tool.name}
                  {status === "needs_key" && (
                    <Lock className="h-3 w-3 ml-1 text-warning" />
                  )}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {/* VirusTotal Tab */}
          <TabsContent value="virustotal">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      VirusTotal
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Analyse de malware et réputation
                    </CardDescription>
                  </div>
                  {!vtKey && (
                    <Badge className="bg-warning/20 text-warning border-warning/30">
                      API Key requise
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <SkeletonList count={5} />
                ) : results && "stats" in results ? (
                  <div className="space-y-4">
                    {/* Detection Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 rounded-lg bg-success/10 border border-success/30">
                        <p className="text-sm text-muted-foreground">Sain</p>
                        <p className="text-2xl font-bold text-success">
                          {(results as typeof mockVirusTotalData).stats.harmless}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                        <p className="text-sm text-muted-foreground">Malveillant</p>
                        <p className="text-2xl font-bold text-destructive">
                          {(results as typeof mockVirusTotalData).stats.malicious}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
                        <p className="text-sm text-muted-foreground">Suspect</p>
                        <p className="text-2xl font-bold text-warning">
                          {(results as typeof mockVirusTotalData).stats.suspicious}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted border border-border">
                        <p className="text-sm text-muted-foreground">Non détecté</p>
                        <p className="text-2xl font-bold text-muted-foreground">
                          {(results as typeof mockVirusTotalData).stats.undetected}
                        </p>
                      </div>
                    </div>

                    {/* Engines */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Moteurs d&apos;analyse</p>
                      {(results as typeof mockVirusTotalData).engines.map((engine, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border"
                        >
                          <span className="text-foreground">{engine.name}</span>
                          <div className="flex items-center gap-2">
                            {engine.category === "harmless" ? (
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            ) : engine.category === "suspicious" ? (
                              <AlertTriangle className="h-4 w-4 text-warning" />
                            ) : (
                              <XCircle className="h-4 w-4 text-destructive" />
                            )}
                            <span className="text-sm text-muted-foreground">
                              {engine.result}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setModalOpen(true)}
                      className="w-full border-border bg-transparent hover:bg-secondary"
                    >
                      Voir le rapport complet
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Entrez une URL, IP ou hash pour analyser
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shodan Tab */}
          <TabsContent value="shodan">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Server className="h-5 w-5 text-primary" />
                      Shodan
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Intelligence sur les services exposés
                    </CardDescription>
                  </div>
                  {!shodanKey && (
                    <Badge className="bg-warning/20 text-warning border-warning/30">
                      API Key requise
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <SkeletonList count={4} />
                ) : results && "ip" in results ? (
                  <div className="space-y-4">
                    {/* Host Info */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                        <p className="text-sm text-muted-foreground">IP</p>
                        <p className="text-lg font-mono text-foreground">
                          {(results as typeof mockShodanData).ip}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                        <p className="text-sm text-muted-foreground">Organisation</p>
                        <p className="text-lg font-semibold text-foreground truncate">
                          {(results as typeof mockShodanData).org}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                        <p className="text-sm text-muted-foreground">Localisation</p>
                        <p className="text-lg text-foreground">
                          {(results as typeof mockShodanData).city},{" "}
                          {(results as typeof mockShodanData).country}
                        </p>
                      </div>
                    </div>

                    {/* Ports */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Ports ouverts</p>
                      <div className="flex flex-wrap gap-2">
                        {(results as typeof mockShodanData).ports.map((port) => (
                          <Badge
                            key={port}
                            className="bg-primary/20 text-primary border-primary/30"
                          >
                            {port}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Services */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Services</p>
                      {(results as typeof mockShodanData).services.map((service, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground font-mono">
                              {service.port}
                            </span>
                            <span className="text-foreground">{service.protocol}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {service.product} {service.version}
                          </span>
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
                    <Server className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Entrez une IP ou un domaine pour scanner
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* DNSDumpster Tab */}
          <TabsContent value="dnsdumpster">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  DNSDumpster
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Reconnaissance DNS et sous-domaines
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <SkeletonList count={4} />
                ) : results && "records" in results ? (
                  <div className="space-y-4">
                    {/* Subdomains */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Sous-domaines trouvés</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {(results as typeof mockDNSDumpsterData).subdomains.map(
                          (subdomain, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border group hover:bg-secondary/50 transition-colors"
                            >
                              <span className="text-foreground font-mono text-sm">
                                {subdomain.host}
                              </span>
                              <span className="text-xs text-muted-foreground font-mono">
                                {subdomain.ip}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* DNS Records */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Enregistrements DNS</p>
                      <div className="space-y-2">
                        {Object.entries((results as typeof mockDNSDumpsterData).records).map(
                          ([type, records]) => (
                            <div
                              key={type}
                              className="p-3 rounded-lg bg-secondary/30 border border-border"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-primary/20 text-primary border-primary/30">
                                  {type}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground font-mono">
                                {Array.isArray(records)
                                  ? records
                                      .map((r) => (typeof r === "string" ? r : r.host || r.ip))
                                      .join(", ")
                                  : records}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setModalOpen(true)}
                      className="w-full border-border bg-transparent hover:bg-secondary"
                    >
                      Exporter les résultats
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <Globe className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Entrez un domaine pour découvrir les DNS
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* theHarvester Tab */}
          <TabsContent value="harvester">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  theHarvester
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Collecte d&apos;emails et informations publiques
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <SkeletonList count={4} />
                ) : results && "emails" in results ? (
                  <div className="space-y-4">
                    {/* Emails */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">
                        Emails trouvés ({(results as typeof mockHarvesterData).emails.length})
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {(results as typeof mockHarvesterData).emails.map((email, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 p-3 rounded-lg bg-secondary/30 border border-border group hover:bg-secondary/50 transition-colors"
                          >
                            <Mail className="h-4 w-4 text-primary shrink-0" />
                            <span className="text-foreground font-mono text-sm truncate">
                              {email}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Hosts */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">
                        Hôtes ({(results as typeof mockHarvesterData).hosts.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(results as typeof mockHarvesterData).hosts.map((host, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="border-border bg-transparent text-foreground font-mono"
                          >
                            {host}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Sources */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Sources utilisées</p>
                      <div className="flex flex-wrap gap-2">
                        {(results as typeof mockHarvesterData).sources.map((source, i) => (
                          <Badge
                            key={i}
                            className="bg-chart-2/20 text-chart-2 border-chart-2/30"
                          >
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setModalOpen(true)}
                      className="w-full border-border bg-transparent hover:bg-secondary"
                    >
                      Exporter les résultats
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Entrez un domaine pour collecter les informations
                    </p>
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
          description={query}
          data={results}
        />
      </div>
    </DashboardLayout>
  )
}
