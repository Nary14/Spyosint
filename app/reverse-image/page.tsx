"use client"

import React from "react"

import { useState, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SkeletonGrid } from "@/components/dashboard/skeleton-card"
import { ResultModal } from "@/components/dashboard/result-modal"
import {
  Upload,
  ImageIcon,
  Search,
  ExternalLink,
  X,
  Loader2,
} from "lucide-react"
import Image from "next/image"

const searchEngines = [
  { id: "lenso", name: "Lenso.ai", url: "https://lenso.ai", color: "bg-chart-1" },
  { id: "tineye", name: "TinEye", url: "https://tineye.com", color: "bg-chart-2" },
  { id: "yandex", name: "Yandex", url: "https://yandex.com/images", color: "bg-chart-3" },
  { id: "google", name: "Google Lens", url: "https://lens.google.com", color: "bg-chart-4" },
]

// Mock results
const mockResults = [
  {
    id: 1,
    source: "Lenso.ai",
    similarity: 98,
    url: "https://example.com/image1.jpg",
    domain: "example.com",
    preview: null,
  },
  {
    id: 2,
    source: "TinEye",
    similarity: 95,
    url: "https://social.com/photo.png",
    domain: "social.com",
    preview: null,
  },
  {
    id: 3,
    source: "Yandex",
    similarity: 87,
    url: "https://news.site/article/image",
    domain: "news.site",
    preview: null,
  },
  {
    id: 4,
    source: "Google Lens",
    similarity: 92,
    url: "https://blog.example/post/photo",
    domain: "blog.example",
    preview: null,
  },
  {
    id: 5,
    source: "Lenso.ai",
    similarity: 76,
    url: "https://archive.org/image",
    domain: "archive.org",
    preview: null,
  },
  {
    id: 6,
    source: "TinEye",
    similarity: 71,
    url: "https://forum.net/thread/img",
    domain: "forum.net",
    preview: null,
  },
]

export default function ReverseImagePage() {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<typeof mockResults | null>(null)
  const [selectedResult, setSelectedResult] = useState<typeof mockResults[0] | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files?.[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type.startsWith("image/")) {
        setFile(droppedFile)
        setPreview(URL.createObjectURL(droppedFile))
        setResults(null)
      }
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
      setResults(null)
    }
  }

  const clearFile = () => {
    setFile(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setResults(null)
  }

  const handleSearch = async (engineId: string) => {
    if (!file) return

    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setResults(mockResults.filter((r) => r.source.toLowerCase().includes(engineId.slice(0, 4))))
    setLoading(false)
  }

  const handleSearchAll = async () => {
    if (!file) return

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setResults(mockResults)
    setLoading(false)
  }

  const openResultDetail = (result: typeof mockResults[0]) => {
    setSelectedResult(result)
    setModalOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reverse Image IA</h1>
          <p className="text-muted-foreground">
            Recherchez des images similaires sur plusieurs moteurs de recherche
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Zone */}
          <Card className="lg:col-span-1 bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Image source</CardTitle>
              <CardDescription className="text-muted-foreground">
                Glissez-déposez ou sélectionnez une image
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!file ? (
                <label
                  htmlFor="file-upload"
                  className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    dragActive
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 hover:bg-secondary/30"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold text-primary">Cliquez</span> ou glissez-déposez
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF jusqu&apos;à 10MB</p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileInput}
                  />
                </label>
              ) : (
                <div className="relative">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                    {preview && (
                      <Image
                        src={preview || "/placeholder.svg"}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={clearFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <p className="mt-2 text-sm text-muted-foreground truncate">
                    {file.name}
                  </p>
                </div>
              )}

              {/* Search Engines */}
              <div className="mt-6 space-y-3">
                <p className="text-sm font-medium text-foreground">Moteurs de recherche</p>
                <div className="grid grid-cols-2 gap-2">
                  {searchEngines.map((engine) => (
                    <Button
                      key={engine.id}
                      variant="outline"
                      size="sm"
                      disabled={!file || loading}
                      onClick={() => handleSearch(engine.id)}
                      className="border-border bg-transparent hover:bg-secondary justify-start"
                    >
                      <div className={`h-2 w-2 rounded-full ${engine.color} mr-2`} />
                      {engine.name}
                    </Button>
                  ))}
                </div>
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={!file || loading}
                  onClick={handleSearchAll}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Rechercher partout
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="lg:col-span-2 bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Résultats</CardTitle>
              <CardDescription className="text-muted-foreground">
                {results ? `${results.length} correspondances trouvées` : "Aucune recherche effectuée"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <SkeletonGrid count={6} />
              ) : results ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {results.map((result) => (
                    <div
                      key={result.id}
                      onClick={() => openResultDetail(result)}
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer group border border-border"
                    >
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">
                            {result.source}
                          </span>
                          <span className="text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                            {result.similarity}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {result.domain}
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Uploadez une image et lancez une recherche
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
          title={selectedResult ? `Résultat - ${selectedResult.source}` : "Résultat"}
          description={selectedResult?.domain}
          data={selectedResult}
          sourceUrl={selectedResult?.url}
        />
      </div>
    </DashboardLayout>
  )
}
