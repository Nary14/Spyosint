"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { SkeletonList } from "@/components/dashboard/skeleton-card"
import { ResultModal } from "@/components/dashboard/result-modal"
import { ApiKeysModal, useApiKey } from "@/components/dashboard/api-keys-modal"
import {
  Brain,
  Sparkles,
  Loader2,
  FileText,
  Link2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Copy,
  Check,
} from "lucide-react"

// Mock investigations for selection
const mockInvestigations = [
  {
    id: "inv-001",
    title: "Analyse domaine suspect - malware.test",
    type: "scan-sites",
    date: "2024-01-28",
    dataPoints: 15,
  },
  {
    id: "inv-002",
    title: "Recherche image - photo_suspect.jpg",
    type: "reverse-image",
    date: "2024-01-27",
    dataPoints: 8,
  },
  {
    id: "inv-003",
    title: "Profil social @target_user",
    type: "social",
    date: "2024-01-26",
    dataPoints: 23,
  },
  {
    id: "inv-004",
    title: "WHOIS - example-corp.com",
    type: "outils-pro",
    date: "2024-01-25",
    dataPoints: 12,
  },
  {
    id: "inv-005",
    title: "VirusTotal - hash suspect",
    type: "outils-pro",
    date: "2024-01-24",
    dataPoints: 45,
  },
]

// Mock AI analysis result
const mockAIAnalysis = {
  summary: `## Rapport de Corrélation OSINT

### Résumé Exécutif
L'analyse croisée des données collectées révèle plusieurs connexions significatives entre les cibles étudiées. La corrélation entre le domaine suspect et le profil social suggère une opération coordonnée.

### Connexions Identifiées

1. **Lien Infrastructure-Identité**
   - Le domaine malware.test partage la même infrastructure IP que des sites précédemment associés au profil @target_user
   - Registrar commun : GoDaddy, enregistré dans un intervalle de 48h

2. **Empreinte Numérique**
   - L'image analysée apparaît sur 3 profils différents avec des noms d'utilisateur similaires
   - Métadonnées EXIF indiquent le même appareil photo (iPhone 13 Pro)

3. **Timeline d'Activité**
   - Pic d'activité coordonné le 2024-01-15 entre 14h et 18h UTC
   - Publication simultanée sur Twitter et LinkedIn

### Indicateurs de Compromission (IOC)
- IP: 93.184.216.34 (associée à 3 domaines suspects)
- Hash: a7b9c8d7e6f5... (détecté par 12 moteurs AV)
- Email: admin@malware.test (présent dans 2 breaches)

### Recommandations
1. Surveillance accrue du cluster IP identifié
2. Alerte sur les nouveaux domaines du même registrant
3. Monitoring des réseaux sociaux pour nouvelles activités

### Score de Confiance: 87%
`,
  correlations: [
    { source: "inv-001", target: "inv-003", type: "infrastructure", confidence: 92 },
    { source: "inv-002", target: "inv-003", type: "identity", confidence: 78 },
    { source: "inv-001", target: "inv-005", type: "threat", confidence: 95 },
  ],
  riskScore: 78,
  entities: [
    { name: "malware.test", type: "domain", risk: "high" },
    { name: "@target_user", type: "account", risk: "medium" },
    { name: "93.184.216.34", type: "ip", risk: "high" },
  ],
}

export default function IACorrelationPage() {
  const [selectedInvestigations, setSelectedInvestigations] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<typeof mockAIAnalysis | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [customPrompt, setCustomPrompt] = useState("")

  const openrouterKey = useApiKey("openrouter")

  const toggleInvestigation = (id: string) => {
    setSelectedInvestigations((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleAnalyze = async () => {
    if (selectedInvestigations.length < 2) return

    setLoading(true)
    setAnalysis(null)

    // Simulate AI API call
    await new Promise((resolve) => setTimeout(resolve, 4000))

    setAnalysis(mockAIAnalysis)
    setLoading(false)
  }

  const handleCopyReport = async () => {
    if (!analysis) return
    await navigator.clipboard.writeText(analysis.summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-destructive/20 text-destructive border-destructive/30"
      case "medium":
        return "bg-warning/20 text-warning border-warning/30"
      case "low":
        return "bg-success/20 text-success border-success/30"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "scan-sites":
        return "Globe"
      case "reverse-image":
        return "Image"
      case "social":
        return "User"
      case "outils-pro":
        return "Shield"
      default:
        return "File"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">IA Corrélation</h1>
            <p className="text-muted-foreground">
              Analyse intelligente et corrélation croisée de vos enquêtes
            </p>
          </div>
          <ApiKeysModal />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Investigation Selection */}
          <Card className="lg:col-span-1 bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Sélection des enquêtes</CardTitle>
              <CardDescription className="text-muted-foreground">
                Sélectionnez au moins 2 enquêtes à corréler
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-2">
                  {mockInvestigations.map((inv) => {
                    const isSelected = selectedInvestigations.includes(inv.id)
                    return (
                      <div
                        key={inv.id}
                        onClick={() => toggleInvestigation(inv.id)}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-primary/10 border-primary/50"
                            : "bg-secondary/30 border-border hover:border-primary/30 hover:bg-secondary/50"
                        }`}
                      >
                        <Checkbox
                          checked={isSelected}
                          className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {inv.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            <span>{inv.date}</span>
                            <span className="text-border">•</span>
                            <span>{inv.dataPoints} points</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>

              {/* Custom Prompt */}
              <div className="mt-4 space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Instructions personnalisées (optionnel)
                </label>
                <Textarea
                  placeholder="Ex: Concentre-toi sur les connexions d'infrastructure..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="bg-input border-border text-foreground resize-none h-20"
                />
              </div>

              {/* API Key Warning */}
              {!openrouterKey && (
                <div className="mt-4 p-3 rounded-lg bg-warning/10 border border-warning/30">
                  <div className="flex items-center gap-2 text-warning">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">API Key OpenRouter requise</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Configurez votre clé API pour utiliser l&apos;analyse IA
                  </p>
                </div>
              )}

              {/* Analyze Button */}
              <Button
                className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={selectedInvestigations.length < 2 || loading}
                onClick={handleAnalyze}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Analyser ({selectedInvestigations.length} sélectionnées)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          <Card className="lg:col-span-2 bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Rapport d&apos;analyse
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Résultats de la corrélation IA
                  </CardDescription>
                </div>
                {analysis && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyReport}
                      className="border-border bg-transparent hover:bg-secondary"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Copié
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copier
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setModalOpen(true)}
                      className="border-border bg-transparent hover:bg-secondary"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
                      <p className="text-foreground font-medium">Analyse des corrélations...</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Traitement par IA en cours
                      </p>
                    </div>
                  </div>
                  <SkeletonList count={3} />
                </div>
              ) : analysis ? (
                <div className="space-y-6">
                  {/* Risk Score */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
                    <div>
                      <p className="text-sm text-muted-foreground">Score de risque global</p>
                      <p className="text-3xl font-bold text-foreground">{analysis.riskScore}%</p>
                    </div>
                    <div
                      className={`h-16 w-16 rounded-full flex items-center justify-center ${
                        analysis.riskScore >= 70
                          ? "bg-destructive/20"
                          : analysis.riskScore >= 40
                          ? "bg-warning/20"
                          : "bg-success/20"
                      }`}
                    >
                      {analysis.riskScore >= 70 ? (
                        <AlertTriangle className="h-8 w-8 text-destructive" />
                      ) : analysis.riskScore >= 40 ? (
                        <AlertTriangle className="h-8 w-8 text-warning" />
                      ) : (
                        <CheckCircle2 className="h-8 w-8 text-success" />
                      )}
                    </div>
                  </div>

                  {/* Entities */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Entités identifiées</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.entities.map((entity, i) => (
                        <Badge
                          key={i}
                          className={getRiskColor(entity.risk)}
                        >
                          {entity.name}
                          <span className="ml-1 opacity-70">({entity.type})</span>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Correlations */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Corrélations détectées</p>
                    <div className="space-y-2">
                      {analysis.correlations.map((corr, i) => {
                        const source = mockInvestigations.find((inv) => inv.id === corr.source)
                        const target = mockInvestigations.find((inv) => inv.id === corr.target)
                        return (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border"
                          >
                            <Link2 className="h-4 w-4 text-primary shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-foreground truncate">
                                <span className="font-medium">{source?.title}</span>
                                <span className="text-muted-foreground mx-2">↔</span>
                                <span className="font-medium">{target?.title}</span>
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Type: {corr.type}
                              </p>
                            </div>
                            <Badge className="bg-primary/20 text-primary border-primary/30">
                              {corr.confidence}%
                            </Badge>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Summary Preview */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Résumé de l&apos;analyse</p>
                    <ScrollArea className="h-[200px] rounded-lg border border-border bg-muted/30 p-4">
                      <div className="prose prose-sm prose-invert max-w-none">
                        <pre className="text-sm text-foreground whitespace-pre-wrap font-sans">
                          {analysis.summary}
                        </pre>
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <Brain className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-foreground mb-2">
                    Prêt pour l&apos;analyse
                  </p>
                  <p className="text-muted-foreground max-w-md">
                    Sélectionnez au moins 2 enquêtes dans le panneau de gauche pour générer un
                    rapport de corrélation intelligent
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Result Modal */}
        <ResultModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          title="Rapport de corrélation complet"
          description={`Analyse de ${selectedInvestigations.length} enquêtes`}
          data={analysis}
        />
      </div>
    </DashboardLayout>
  )
}
