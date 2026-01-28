"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Key, Save, Eye, EyeOff, Check } from "lucide-react"

interface ApiKey {
  id: string
  label: string
  placeholder: string
}

const API_KEYS: ApiKey[] = [
  { id: "openrouter", label: "OpenRouter API Key", placeholder: "sk-or-..." },
  { id: "virustotal", label: "VirusTotal API Key", placeholder: "Votre clé VirusTotal" },
  { id: "shodan", label: "Shodan API Key", placeholder: "Votre clé Shodan" },
]

export function ApiKeysModal() {
  const [open, setOpen] = useState(false)
  const [keys, setKeys] = useState<Record<string, string>>({})
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Load keys from localStorage on mount
    const savedKeys: Record<string, string> = {}
    API_KEYS.forEach((key) => {
      const value = localStorage.getItem(`spyosint_${key.id}`)
      if (value) savedKeys[key.id] = value
    })
    setKeys(savedKeys)
  }, [])

  const handleSave = () => {
    // Save keys to localStorage
    Object.entries(keys).forEach(([id, value]) => {
      if (value) {
        localStorage.setItem(`spyosint_${id}`, value)
      } else {
        localStorage.removeItem(`spyosint_${id}`)
      }
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const toggleShowKey = (id: string) => {
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-border bg-transparent hover:bg-secondary"
        >
          <Key className="h-4 w-4 mr-2" />
          API Keys
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Configuration API</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Configurez vos clés API pour accéder aux services externes.
            Les clés sont stockées localement dans votre navigateur.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {API_KEYS.map((apiKey) => (
            <div key={apiKey.id} className="space-y-2">
              <Label htmlFor={apiKey.id} className="text-foreground">
                {apiKey.label}
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id={apiKey.id}
                    type={showKeys[apiKey.id] ? "text" : "password"}
                    placeholder={apiKey.placeholder}
                    value={keys[apiKey.id] || ""}
                    onChange={(e) =>
                      setKeys((prev) => ({ ...prev, [apiKey.id]: e.target.value }))
                    }
                    className="bg-input border-border text-foreground pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground hover:text-foreground"
                    onClick={() => toggleShowKey(apiKey.id)}
                  >
                    {showKeys[apiKey.id] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {saved ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Sauvegardé
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function useApiKey(keyId: string): string | null {
  const [key, setKey] = useState<string | null>(null)

  useEffect(() => {
    setKey(localStorage.getItem(`spyosint_${keyId}`))
  }, [keyId])

  return key
}
