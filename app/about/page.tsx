"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Eye,
  ImageIcon,
  Globe,
  User,
  Wrench,
  Brain,
  Shield,
  Github,
  Facebook,
  ExternalLink,
  Heart,
  Code,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: ImageIcon,
    title: "Reverse Image IA",
    description: "Recherche inversee d images avec Lenso.ai, TinEye et Yandex",
  },
  {
    icon: Globe,
    title: "Scan Sites",
    description: "Analyse de sites web via Wayback Machine, CommonCrawl et WHOIS",
  },
  {
    icon: User,
    title: "Social Scanner",
    description: "Recherche de profils sur Twitter, Facebook, Instagram et LinkedIn",
  },
  {
    icon: Wrench,
    title: "Outils PRO",
    description: "Integration VirusTotal, Shodan, DNSDumpster et theHarvester",
  },
  {
    icon: Brain,
    title: "IA Correlation",
    description: "Analyse croisee intelligente avec OpenRouter et Claude AI",
  },
]

const techStack = [
  { name: "Next.js 16", category: "Framework" },
  { name: "React 19", category: "UI Library" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "shadcn/ui", category: "Components" },
  { name: "Lucide Icons", category: "Icons" },
]

export default function AboutPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Hero Section */}
        <Card className="bg-card border-border overflow-hidden">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
            <CardContent className="relative pt-8 pb-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
                  <Eye className="h-10 w-10 text-primary-foreground" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-foreground">SpyOSINT</h1>
                  <p className="text-muted-foreground max-w-md">
                    Dashboard professionnel d intelligence Open Source pour les investigations numeriques
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                    v1.0.0
                  </Badge>
                  <Badge variant="outline" className="border-border">
                    Production Ready
                  </Badge>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Features */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>Fonctionnalites</CardTitle>
              </div>
              <CardDescription>
                Outils OSINT integres dans l application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="font-medium text-foreground">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Tech Stack */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                <CardTitle>Stack Technique</CardTitle>
              </div>
              <CardDescription>
                Technologies utilisees pour le developpement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {techStack.map((tech, index) => (
                  <div
                    key={index}
                    className="flex flex-col rounded-lg border border-border bg-secondary/50 p-3 transition-colors hover:bg-secondary"
                  >
                    <span className="font-medium text-foreground">{tech.name}</span>
                    <span className="text-xs text-muted-foreground">{tech.category}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Creator */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                <CardTitle>Createur</CardTitle>
              </div>
              <CardDescription>
                Developpe avec passion par
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-secondary/50 border border-border">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 text-3xl font-bold text-primary-foreground">
                  RT
                </div>
                <div className="flex-1 text-center sm:text-left space-y-3">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Raomelinary Tsiresy</h3>
                    <p className="text-muted-foreground">Developpeur Full-Stack</p>
                  </div>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent" asChild>
                      <Link href="https://github.com/Nary14" target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                        GitHub
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent" asChild>
                      <Link href="https://www.facebook.com/tsires.raomelinary" target="_blank" rel="noopener noreferrer">
                        <Facebook className="h-4 w-4" />
                        Facebook
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security & Privacy */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Securite et Confidentialite</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-secondary/30 p-4 text-center">
                  <div className="text-2xl font-bold text-primary">100%</div>
                  <div className="text-sm text-muted-foreground">Donnees locales</div>
                </div>
                <div className="rounded-lg border border-border bg-secondary/30 p-4 text-center">
                  <div className="text-2xl font-bold text-primary">AES-256</div>
                  <div className="text-sm text-muted-foreground">Chiffrement</div>
                </div>
                <div className="rounded-lg border border-border bg-secondary/30 p-4 text-center">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground">Tracking</div>
                </div>
              </div>
              <Separator className="bg-border" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                SpyOSINT respecte votre vie privee. Aucune donnee personnelle n est collectee ou partagee. 
                Les cles API sont stockees localement et les requetes sont effectuees directement depuis votre navigateur 
                vers les services tiers. L application fonctionne entierement cote client pour les fonctionnalites de base.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground py-4">
          <p>
            SpyOSINT - Open Source Intelligence Dashboard
          </p>
          <p className="mt-1">
            Fait avec <Heart className="inline h-3 w-3 text-destructive" /> a Madagascar
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
