"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Key,
  Bell,
  Shield,
  Database,
  Trash2,
  Download,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Save,
  RotateCcw,
} from "lucide-react"

interface ApiKeyConfig {
  key: string
  label: string
  placeholder: string
  connected: boolean
}

export default function SettingsPage() {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    openrouter: "",
    virustotal: "",
    shodan: "",
    hunter: "",
  })
  const [settings, setSettings] = useState({
    notifications: true,
    autoSave: true,
    darkMode: true,
    compactView: false,
    exportFormat: "json",
    dataRetention: "30",
    secureMode: true,
  })
  const [saved, setSaved] = useState(false)

  const apiKeyConfigs: ApiKeyConfig[] = [
    {
      key: "openrouter",
      label: "OpenRouter API",
      placeholder: "sk-or-v1-...",
      connected: true,
    },
    {
      key: "virustotal",
      label: "VirusTotal API",
      placeholder: "Votre cle API VirusTotal",
      connected: true,
    },
    {
      key: "shodan",
      label: "Shodan API",
      placeholder: "Votre cle API Shodan",
      connected: true,
    },
    {
      key: "hunter",
      label: "Hunter.io API",
      placeholder: "Votre cle API Hunter.io",
      connected: false,
    },
  ]

  const toggleShowKey = (key: string) => {
    setShowKeys((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    setSettings({
      notifications: true,
      autoSave: true,
      darkMode: true,
      compactView: false,
      exportFormat: "json",
      dataRetention: "30",
      secureMode: true,
    })
    setApiKeys({
      openrouter: "",
      virustotal: "",
      shodan: "",
      hunter: "",
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Parametres</h1>
            <p className="text-muted-foreground">
              Configurez votre environnement SpyOSINT
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} className="gap-2 bg-transparent">
              <RotateCcw className="h-4 w-4" />
              Reinitialiser
            </Button>
            <Button onClick={handleSave} className="gap-2">
              {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {saved ? "Enregistre" : "Enregistrer"}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* API Keys */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                <CardTitle>Cles API</CardTitle>
              </div>
              <CardDescription>
                Gerez vos cles API pour les services externes. Les cles sont stockees de maniere securisee.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {apiKeyConfigs.map((config) => (
                  <div key={config.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={config.key}>{config.label}</Label>
                      {config.connected ? (
                        <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10">
                          <Check className="mr-1 h-3 w-3" />
                          Connecte
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          <AlertCircle className="mr-1 h-3 w-3" />
                          Non configure
                        </Badge>
                      )}
                    </div>
                    <div className="relative">
                      <Input
                        id={config.key}
                        type={showKeys[config.key] ? "text" : "password"}
                        placeholder={config.placeholder}
                        value={apiKeys[config.key]}
                        onChange={(e) =>
                          setApiKeys((prev) => ({ ...prev, [config.key]: e.target.value }))
                        }
                        className="pr-10 bg-input border-border"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => toggleShowKey(config.key)}
                      >
                        {showKeys[config.key] ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Les cles API sont stockees localement et transmises de maniere securisee aux serveurs.
              </p>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>
                Configurez les alertes et notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertes de resultats</Label>
                  <p className="text-xs text-muted-foreground">
                    Notification a la fin des analyses
                  </p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({ ...prev, notifications: checked }))
                  }
                />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sauvegarde automatique</Label>
                  <p className="text-xs text-muted-foreground">
                    Enregistrer les enquetes automatiquement
                  </p>
                </div>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({ ...prev, autoSave: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Interface */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Interface</CardTitle>
              </div>
              <CardDescription>
                Personnalisez l affichage de l application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mode sombre</Label>
                  <p className="text-xs text-muted-foreground">
                    Theme sombre pour l interface
                  </p>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({ ...prev, darkMode: checked }))
                  }
                />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Vue compacte</Label>
                  <p className="text-xs text-muted-foreground">
                    Reduire l espacement des elements
                  </p>
                </div>
                <Switch
                  checked={settings.compactView}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({ ...prev, compactView: checked }))
                  }
                />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mode securise</Label>
                  <p className="text-xs text-muted-foreground">
                    Masquer les informations sensibles
                  </p>
                </div>
                <Switch
                  checked={settings.secureMode}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({ ...prev, secureMode: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                <CardTitle>Gestion des donnees</CardTitle>
              </div>
              <CardDescription>
                Gerez le stockage et l export de vos donnees
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Format d export</Label>
                  <Select
                    value={settings.exportFormat}
                    onValueChange={(value) =>
                      setSettings((prev) => ({ ...prev, exportFormat: value }))
                    }
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Retention des donnees</Label>
                  <Select
                    value={settings.dataRetention}
                    onValueChange={(value) =>
                      setSettings((prev) => ({ ...prev, dataRetention: value }))
                    }
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 jours</SelectItem>
                      <SelectItem value="30">30 jours</SelectItem>
                      <SelectItem value="90">90 jours</SelectItem>
                      <SelectItem value="365">1 an</SelectItem>
                      <SelectItem value="unlimited">Illimite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator className="bg-border" />
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Exporter toutes les donnees
                </Button>
                <Button variant="outline" className="gap-2 text-destructive hover:text-destructive bg-transparent">
                  <Trash2 className="h-4 w-4" />
                  Supprimer les donnees
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
