"use client"

import React, { useState, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Upload,
  ImageIcon,
  X,
  Loader2,
  BrainCircuit,
  Zap,
  Search,
  Globe,
  Link as LinkIcon
} from "lucide-react"
import Image from "next/image"
import ReactMarkdown from "react-markdown"

// Ta liste optimisée de modèles gratuits et stables
const aiModels = [
  { id: "nvidia/nemotron-nano-12b-v2-vl:free", name: "Nemotron Nano 12B VL", desc: "Vision native ultra-puissante", color: "text-emerald-400", cost: 0 },
  { id: "meta-llama/llama-3.2-11b-vision-instruct:free", name: "Llama 3.2 11B Vision", desc: "Analyse image experte Meta", color: "text-indigo-400", cost: 0 },
  { id: "allenai/molmo-2-8b:free", name: "Molmo 2 8B", desc: "Vision AllenAI spécialisée", color: "text-orange-400", cost: 0 },
  { id: "mistralai/pixtral-12b:free", name: "Pixtral 12B", desc: "Vision Mistral optimisée", color: "text-violet-400", cost: 0 },
  { id: "qwen/qwen2.5-vl-7b-instruct:free", name: "Qwen 2.5 VL", desc: "Précision chirurgicale OCR", color: "text-cyan-400", cost: 0 }
]

export default function ReverseImagePage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState(aiModels[0].id)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files?.[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type.startsWith("image/")) {
        setFile(droppedFile)
        setPreview(URL.createObjectURL(droppedFile))
        setAiAnalysis(null)
      }
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
      setAiAnalysis(null)
    }
  }

  const runAiAnalysis = async () => {
    if (!file) return
    setLoading(true)
    setAiAnalysis(null)

    try {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = async () => {
        const base64Image = reader.result as string
        const response = await fetch("/api/analyze-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64Image, model: selectedModel }),
        })
        const data = await response.json()
        if (response.ok && data.analysis) {
          setAiAnalysis(data.analysis)
        } else {
          setAiAnalysis(`ERREUR_SYSTEME : ${data.error || "Échec de l'analyse"}`)
        }
        setLoading(false)
      }
    } catch (error) {
      setAiAnalysis("Erreur critique de connexion.")
      setLoading(false)
    }
  }

  const launchDeepSearch = (type: 'google' | 'yandex' | 'dork') => {
    if (!aiAnalysis) return
    // On extrait le premier titre ou sujet identifié pour la recherche
    const lines = aiAnalysis.split('\n').filter(l => l.trim().length > 0)
    const query = lines[0].replace(/[#*]/g, '').replace("IDENTIFICATION :", "").trim()
    
    let url = ""
    if (type === 'google') url = `https://www.google.com/search?q=${encodeURIComponent(query)}`
    if (type === 'yandex') url = `https://yandex.com/images/search?rpt=imageview&url=${preview}`
    if (type === 'dork') url = `https://www.google.com/search?q=${encodeURIComponent('intitle:"' + query + '" OR site:reddit.com OR site:twitter.com "' + query + '"')}`
    
    window.open(url, '_blank')
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 w-full">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-medium tracking-tight text-white">
            Analyse <span className="text-emerald-500">image IA</span>
          </h1>
          <p className="text-emerald-500/60 font-mono text-xs italic tracking-widest">
            {">"} SYSTEME_D_INVESTIGATION_OSINT_V2.0
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start w-full">
          {/* Colonne Gauche : Input & Config */}
          <div className="xl:col-span-5 space-y-6">
            <Card className="bg-neutral-900/40 border-emerald-500/10 backdrop-blur-md">
              <CardContent className="p-6 space-y-6">
                {!file ? (
                  <label 
                    onDrop={handleDrop} 
                    onDragOver={(e) => e.preventDefault()} 
                    className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-emerald-500/20 rounded-xl cursor-pointer hover:bg-emerald-500/5 transition-all"
                  >
                    <Upload className="h-10 w-10 text-emerald-500/50 mb-4" />
                    <span className="text-sm font-mono text-emerald-500/70 lowercase tracking-widest italic">deposer_image_source</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileInput} />
                  </label>
                ) : (
                  <div className="relative w-full h-56 rounded-xl overflow-hidden border border-emerald-500/30">
                    <Image src={preview!} alt="Preview" fill className="object-cover" />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2 rounded-full h-8 w-8" 
                      onClick={() => {setFile(null); setPreview(null); setAiAnalysis(null);}}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest font-bold">Sélecteur de Sonde IA (Free)</h3>
                  <div className="grid grid-cols-1 gap-2 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
                    {aiModels.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedModel(m.id)}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all text-left ${
                          selectedModel === m.id 
                          ? "border-emerald-500 bg-emerald-500/10" 
                          : "border-emerald-500/10 bg-black/40 hover:border-emerald-500/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <BrainCircuit className={`h-4 w-4 ${m.color}`} />
                          <div>
                            <p className="text-xs font-medium text-white">{m.name}</p>
                            <p className="text-[9px] text-zinc-500 leading-none mt-1">{m.desc}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={runAiAnalysis} 
                  disabled={!file || loading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold tracking-tighter h-12"
                >
                  {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Zap className="mr-2 h-4 w-4 fill-current" />}
                  LANCER_L_INVESTIGATION
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Colonne Droite : Analyse & Action Web */}
          <div className="xl:col-span-7 space-y-6">
            <Card className="bg-neutral-900/40 border-emerald-500/10 min-h-[550px] flex flex-col overflow-hidden">
              <CardHeader className="border-b border-emerald-500/5 bg-black/20">
                <CardTitle className="tracking-tight text-lg font-medium flex items-center gap-2">
                  <Search className="h-4 w-4 text-emerald-500" />
                  Rapport de Scan Vision
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 font-mono flex-1">
                {loading ? (
                  <div className="space-y-4">
                    <div className="h-3 bg-emerald-500/10 w-3/4 rounded animate-pulse" />
                    <div className="h-3 bg-emerald-500/10 w-full rounded animate-pulse delay-75" />
                    <div className="h-3 bg-emerald-500/10 w-1/2 rounded animate-pulse delay-150" />
                    <p className="text-[10px] text-emerald-500 italic mt-6 animate-bounce">acquisition_des_donnees_en_cours...</p>
                  </div>
                ) : aiAnalysis ? (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="text-emerald-400 text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown 
                        components={{
                          strong: ({node, ...props}) => <span className="text-emerald-300 font-bold underline" {...props} />,
                          p: ({node, ...props}) => <p className="mb-4" {...props} />,
                        }}
                      >
                        {aiAnalysis}
                      </ReactMarkdown>
                    </div>

                    {/* ACTIONS DE SCAN REELLES */}
                    <div className="pt-6 border-t border-emerald-500/10">
                      <p className="text-[10px] uppercase tracking-widest text-emerald-500/50 mb-4 font-bold italic">Module de Recherche Web Automatisé</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Button onClick={() => launchDeepSearch('google')} variant="outline" className="border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/20 text-emerald-400 text-xs gap-2 h-10">
                          <Globe className="h-3 w-3" /> Google Global
                        </Button>
                        <Button onClick={() => launchDeepSearch('yandex')} variant="outline" className="border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/20 text-emerald-400 text-xs gap-2 h-10">
                          <ImageIcon className="h-3 w-3" /> Reverse Yandex
                        </Button>
                        <Button onClick={() => launchDeepSearch('dork')} variant="outline" className="border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/20 text-emerald-400 text-xs gap-2 h-10">
                          <LinkIcon className="h-3 w-3" /> Social-Dorking
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-emerald-500/10">
                    <ImageIcon className="h-20 w-20 mb-4 opacity-5" />
                    <p className="text-xs uppercase tracking-widest font-bold">Aucune image chargée</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}