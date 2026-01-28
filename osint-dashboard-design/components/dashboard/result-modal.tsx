"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, Download, Check, ExternalLink } from "lucide-react"

interface ResultModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  data: Record<string, unknown> | string | null
  sourceUrl?: string
}

export function ResultModal({
  open,
  onOpenChange,
  title,
  description,
  data,
  sourceUrl,
}: ResultModalProps) {
  const [copied, setCopied] = useState(false)

  const formattedData = typeof data === "string" ? data : JSON.stringify(data, null, 2)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(formattedData)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExport = () => {
    const blob = new Blob([formattedData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}-export.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground flex items-center gap-2">
            {title}
            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-muted-foreground">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] rounded-lg border border-border bg-muted/30 p-4">
          <pre className="text-sm text-foreground font-mono whitespace-pre-wrap break-words">
            {formattedData}
          </pre>
        </ScrollArea>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="border-border bg-transparent hover:bg-secondary"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copié
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copier
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="border-border bg-transparent hover:bg-secondary"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter JSON
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
