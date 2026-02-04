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
} from "lucide-react"

// --- TYPES POUR TYPESCRIPT ---
interface DNSHost {
  host: string;
  ip?: string;
  priority?: number;
  asn?: string;
}

interface DNSDumpsterData {
  domain: string;
  records: Record<string, (string | DNSHost)[]>;
  subdomains: { host: string; ip: string }[];
}

// Mock Data
const mockVirusTotalData = {
  url: "example.com",
  scanDate: "2024-01-28",
  stats: { harmless: 68, malicious: 0, suspicious: 2, undetected: 10 },
  engines: [
    { name: "Google Safebrowsing", result: "clean", category: "harmless" },
    { name: "Kaspersky", result: "clean", category: "harmless" },
    { name: "BitDefender", result: "clean", category: "harmless" },
    { name: "ESET", result: "suspicious", category: "suspicious" },
    { name: "Avira", result: "clean", category: "harmless" },
  ],
}

const mockShodanData = {
  ip: "93.184.216.34",
  org: "Edgecast Inc.",
  city: "Los Angeles",
  country: "United States",
  ports: [80, 443],
  services: [
    { port: 80, protocol: "http", product: "ECS", version: "2.0" },
    { port: 443, protocol: "https", product: "ECS", version: "2.0" },
  ],
}

const mockDNSDumpsterData: DNSDumpsterData = {
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
  ],
}

const mockHarvesterData = {
  emails: ["admin@example.com", "info@example.com"],
  hosts: ["example.com", "www.example.com"],
  sources: ["bing", "google"],
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
  const [results, setResults] = useState<any | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const vtKey = useApiKey("virustotal")
  const shodanKey = useApiKey("shodan")

  const handleSearch = async (toolId: string) => {
    if (!query) return
    setLoading(true)
    setActiveTab(toolId)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    switch (toolId) {
      case "virustotal": setResults(mockVirusTotalData); break
      case "shodan": setResults(mockShodanData); break
      case "dnsdumpster": setResults(mockDNSDumpsterData); break
      case "harvester": setResults(mockHarvesterData); break
      default: setResults(null)
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Outils PRO</h1>
            <p className="text-muted-foreground">Analyse de sécurité et reconnaissance</p>
          </div>
          <ApiKeysModal />
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="URL, IP, domaine..." 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                  className="pl-10"
                />
              </div>
              <Button onClick={() => handleSearch(activeTab)} disabled={!query || loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Analyser"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start overflow-x-auto">
            {tools.map((tool) => (
              <TabsTrigger key={tool.id} value={tool.id} className="flex-1">
                <tool.icon className="h-4 w-4 mr-2" />
                {tool.name}
                {getToolStatus(tool.id) === "needs_key" && <Lock className="h-3 w-3 ml-2 text-yellow-500" />}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* VirusTotal */}
          <TabsContent value="virustotal">
             <Card>
                <CardContent className="pt-6">
                {results && results.stats ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-green-500/10 rounded-lg">Sain: {results.stats.harmless}</div>
                        <div className="p-4 bg-red-500/10 rounded-lg">Malveillant: {results.stats.malicious}</div>
                    </div>
                ) : <p className="text-center py-10">Lancez une analyse VirusTotal</p>}
                </CardContent>
             </Card>
          </TabsContent>

          {/* Shodan */}
          <TabsContent value="shodan">
            <Card>
                <CardContent className="pt-6">
                    {results && results.ip ? (
                        <div className="space-y-2">
                            <p><strong>IP:</strong> {results.ip}</p>
                            <p><strong>Org:</strong> {results.org}</p>
                        </div>
                    ) : <p className="text-center py-10">Lancez une analyse Shodan</p>}
                </CardContent>
            </Card>
          </TabsContent>

          {/* DNSDumpster - LA CORRECTION EST ICI */}
          <TabsContent value="dnsdumpster">
            <Card>
              <CardHeader><CardTitle>Résultats DNS</CardTitle></CardHeader>
              <CardContent>
                {results && results.records ? (
                  <div className="space-y-4">
                    {Object.entries(results.records as Record<string, any[]>).map(([type, records]) => (
                      <div key={type} className="p-3 border rounded-lg bg-secondary/20">
                        <Badge className="mb-2">{type}</Badge>
                        <div className="text-sm font-mono">
                          {records.map((r, i) => {
                            if (typeof r === "string") return r;
                            const parts = [];
                            if (r.host) parts.push(r.host);
                            if (r.ip) parts.push(`(${r.ip})`);
                            if (r.priority) parts.push(`[${r.priority}]`);
                            return <div key={i}>{parts.join(" ")}</div>;
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-center py-10 text-muted-foreground">Aucune donnée DNS</p>}
              </CardContent>
            </Card>
          </TabsContent>

          {/* theHarvester */}
          <TabsContent value="harvester">
             <Card>
                <CardContent className="pt-6">
                {results && results.emails ? (
                    <div className="space-y-4">
                        <p className="font-bold">Emails trouvés:</p>
                        {results.emails.map((e: string) => <Badge key={e} variant="outline" className="mr-2">{e}</Badge>)}
                    </div>
                ) : <p className="text-center py-10">Lancez theHarvester</p>}
                </CardContent>
             </Card>
          </TabsContent>
        </Tabs>

        <ResultModal open={modalOpen} onOpenChange={setModalOpen} title="Détails" data={results} />
      </div>
    </DashboardLayout>
  )
}