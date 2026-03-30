"use client"

import React, { useState, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Upload, X, Loader2, BrainCircuit, Zap, Search, 
  Globe, MapPin, User, FileText, Lightbulb, ShieldCheck 
} from "lucide-react"
import Image from "next/image"
import ReactMarkdown from "react-markdown"

// Utilisation de ta nouvelle liste d'IA performantes
const aiModels = [
  { 
    id: "nvidia/nemotron-nano-12b-v2-vl:free", 
    name: "Nemotron Nano VL", 
    desc: "Vision native (Pipeline OSINT)", 
    color: "text-emerald-400" 
  },
  { 
    id: "google/gemini-2.0-flash-lite-preview-02-05:free", 
    name: "Gemini 2.0 Flash", 
    desc: "Vitesse pure (Backup)", 
    color: "text-blue-400" 
  }
]

export default function ReverseImagePage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<string>("") 
  const [selectedModel, setSelectedModel] = useState(aiModels[0].id)
  
  // États des résultats
  const [visionResult, setVisionResult] = useState<any>(null)
  const [finalReport, setFinalReport] = useState<string | null>(null)

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0]
      setFile(f)
      setPreview(URL.createObjectURL(f))
      setVisionResult(null)
      setFinalReport(null)
    }
  }

  const runFullInvestigation = async () => {
    if (!file) return
    setLoading(true)
    setVisionResult(null)
    setFinalReport(null)

    try {
      // --- ÉTAPE 1 : VISION (Nemotron Nano VL) ---
      setStep("PHASE 1 : Analyse visuelle (Nemotron VL)...")
      
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = async () => {
        const base64Image = reader.result as string
        
        const resVision = await fetch("/api/analyze-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64Image, model: selectedModel }),
        })
        
        const visionData = await resVision.json()
        setVisionResult(visionData)

        if (!visionData.raw_vision) {
          throw new Error("L'analyse visuelle a échoué.")
        }

        // --- ÉTAPE 2 : INVESTIGATION & CRAWL (Dolphin Mistral) ---
        setStep("PHASE 2 : Investigation Web & Rédaction (Dolphin)...")
        
        const resBio = await fetch("/api/auto-investigate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ raw_vision: visionData.raw_vision }),
        })
        
        const investigationData = await resBio.json()
        setFinalReport(investigationData.full_report)
        
        setLoading(false)
        setStep("")
      }
    } catch (error) {
      console.error(error)
      setStep("ERREUR CRITIQUE DANS LA PIPELINE")
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 w-full pb-20">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-medium tracking-tight text-white">
            Spy<span className="text-emerald-500">OSINT</span> Intelligence
          </h1>
          <p className="text-emerald-500/60 font-mono text-xs italic">
             {">"} PIPELINE : NEMOTRON-VL + DOLPHIN-MISTRAL + CRAWLING_WEB
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* COLONNE GAUCHE : INPUT */}
          <div className="xl:col-span-4 space-y-6">
            <Card className="bg-neutral-900/40 border-emerald-500/10 backdrop-blur-md">
              <CardContent className="p-6 space-y-6">
                {!file ? (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-emerald-500/20 rounded-xl cursor-pointer hover:bg-emerald-500/5 transition-all">
                    <Upload className="h-10 w-10 text-emerald-500/50 mb-4" />
                    <span className="text-xs font-mono text-emerald-500/70 tracking-tighter">CHARGER_IMAGE_CIBLE</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileInput} />
                  </label>
                ) : (
                  <div className="relative w-full h-64 rounded-xl overflow-hidden border border-emerald-500/30">
                    <Image src={preview!} alt="Target" fill className="object-cover" />
                    <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={() => {setFile(null); setPreview(null);}}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="text-[10px] font-mono text-emerald-500 uppercase font-bold tracking-widest">Sonde de Vision</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {aiModels.map((m) => (
                      <button key={m.id} onClick={() => setSelectedModel(m.id)} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${selectedModel === m.id ? "border-emerald-500 bg-emerald-500/10" : "border-emerald-500/10 bg-black/40"}`}>
                        <BrainCircuit className={`h-4 w-4 ${m.color}`} />
                        <div className="text-left">
                          <p className="text-xs font-bold text-white">{m.name}</p>
                          <p className="text-[9px] text-zinc-500 uppercase">{m.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button onClick={runFullInvestigation} disabled={!file || loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Zap className="mr-2 h-4 w-4 fill-current" />}
                  LANCER_L_ENQUÊTE
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* COLONNE DROITE : RÉSULTATS */}
          <div className="xl:col-span-8">
            <Card className="bg-neutral-900/40 border-emerald-500/10 min-h-[650px] flex flex-col">
              <CardHeader className="border-b border-emerald-500/5 bg-black/20 py-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-mono flex items-center gap-2 text-emerald-500">
                    <ShieldCheck className="h-4 w-4" /> RAPPORT_D_INVESTIGATION_OSINT
                  </CardTitle>
                  {loading && <span className="text-[10px] animate-pulse text-emerald-400 font-mono tracking-tighter">{step}</span>}
                </div>
              </CardHeader>

              <CardContent className="p-6 font-mono overflow-y-auto">
                {!visionResult && !loading && (
                  <div className="flex flex-col items-center justify-center h-full min-h-[400px] opacity-20">
                    <Search className="h-20 w-20 mb-4" />
                    <p className="text-xs tracking-[0.3em]">EN_ATTENTE_DE_SCAN</p>
                  </div>
                )}

                {visionResult && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
                    
                    {/* VISION BRUTE (Nemotron) */}
                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-3 w-3 text-emerald-500" />
                        <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Analyse Visuelle (Nemotron)</span>
                      </div>
                      <p className="text-zinc-300 text-sm leading-relaxed">{visionResult.raw_vision}</p>
                    </div>

                    {/* RAPPORT FINAL (Dolphin) */}
                    {finalReport ? (
                      <div className="space-y-6 animate-in zoom-in-95 duration-500">
                        <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                        <div className="text-white text-sm leading-relaxed prose prose-invert max-w-none prose-p:mb-4 prose-headings:text-emerald-400 prose-headings:font-mono prose-headings:uppercase prose-headings:text-xs prose-headings:tracking-[0.2em]">
                          <ReactMarkdown>{finalReport}</ReactMarkdown>
                        </div>
                      </div>
                    ) : (
                      loading && (
                        <div className="flex flex-col gap-3 py-10">
                          <div className="h-2 w-full bg-emerald-500/10 rounded animate-pulse" />
                          <div className="h-2 w-2/3 bg-emerald-500/10 rounded animate-pulse delay-75" />
                          <div className="h-2 w-3/4 bg-emerald-500/10 rounded animate-pulse delay-150" />
                          <p className="text-[9px] text-emerald-500/40 mt-4 italic">Dolphin_Mistral est en train de crawler et rédiger le rapport...</p>
                        </div>
                      )
                    )}
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