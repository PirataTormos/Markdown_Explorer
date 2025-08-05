"use client"

import * as React from "react"
import { FileText, Calendar, HardDrive, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useMarkdownStore } from "@/lib/store"

interface FileContent {
  content: string
  path: string
  size: number
  modified: string
}

// Componente simple para renderizar Markdown sin dependencias externas
function SimpleMarkdownRenderer({ content }: { content: string }) {
  const renderMarkdown = (text: string) => {
    // Convertir headers
    text = text.replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-5 mb-2">$1</h3>')
    text = text.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mt-6 mb-3">$1</h2>')
    text = text.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4 pb-2 border-b border-border">$1</h1>')

    // Convertir código en línea
    text = text.replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')

    // Convertir bloques de código
    text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || "text"
      return `<div class="relative my-4">
        <div class="absolute top-2 right-2 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">${language}</div>
        <pre class="bg-muted p-4 rounded-lg overflow-x-auto border">
          <code class="text-sm font-mono">${code.trim()}</code>
        </pre>
      </div>`
    })

    // Convertir enlaces
    text = text.replace(
      /\[([^\]]+)\]$$([^)]+)$$/g,
      '<a href="$2" class="text-primary hover:text-primary/80 underline underline-offset-2 hover:underline-offset-4 transition-all" target="_blank" rel="noopener noreferrer">$1</a>',
    )

    // Convertir texto en negrita
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    text = text.replace(/__(.*?)__/g, "<strong>$1</strong>")

    // Convertir texto en cursiva
    text = text.replace(/\*(.*?)\*/g, "<em>$1</em>")
    text = text.replace(/_(.*?)_/g, "<em>$1</em>")

    // Convertir listas
    text = text.replace(/^- (.*$)/gim, '<li class="text-foreground">$1</li>')
    text = text.replace(/^\* (.*$)/gim, '<li class="text-foreground">$1</li>')
    text = text.replace(/^\+ (.*$)/gim, '<li class="text-foreground">$1</li>')

    // Envolver listas en ul
    text = text.replace(
      /(<li class="text-foreground">.*<\/li>)/gs,
      '<ul class="list-disc list-inside space-y-1 my-4">$1</ul>',
    )

    // Convertir listas numeradas
    text = text.replace(/^\d+\. (.*$)/gim, '<li class="text-foreground">$1</li>')

    // Convertir blockquotes
    text = text.replace(
      /^> (.*$)/gim,
      '<blockquote class="border-l-4 border-primary/20 pl-4 py-2 my-4 italic text-muted-foreground bg-muted/30 rounded-r">$1</blockquote>',
    )

    // Convertir líneas horizontales
    text = text.replace(/^---$/gim, '<hr class="border-border my-8" />')

    // Convertir saltos de línea
    text = text.replace(/\n\n/g, '</p><p class="mb-4">')
    text = text.replace(/\n/g, "<br />")

    return `<div class="prose prose-gray dark:prose-invert max-w-none"><p class="mb-4">${text}</p></div>`
  }

  return <div className="markdown-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
}

export function MarkdownViewer() {
  const [content, setContent] = React.useState<FileContent | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const { currentFile } = useMarkdownStore()

  React.useEffect(() => {
    if (currentFile) {
      loadFileContent(currentFile)
    }
  }, [currentFile])

  const loadFileContent = async (filePath: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/content?path=${encodeURIComponent(filePath)}`)
      const data = await response.json()

      if (data.success) {
        setContent(data.data)
      } else {
        setError(data.error || "Failed to load file")
      }
    } catch (err) {
      setError("Failed to load file content")
      console.error("Error loading file:", err)
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!currentFile) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Welcome to Markdown Explorer</h2>
          <p className="text-muted-foreground">Select a file from the sidebar to start reading</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading file content...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Error Loading File</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (!content) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* File Info Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {content.path.split("/").pop()}
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <HardDrive className="h-4 w-4" />
              {formatFileSize(content.size)}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(content.modified)}
            </div>
            <Badge variant="secondary">{content.path.split(".").pop()?.toUpperCase()}</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Markdown Content */}
      <Card>
        <CardContent className="p-6">
          <SimpleMarkdownRenderer content={content.content} />
        </CardContent>
      </Card>
    </div>
  )
}
