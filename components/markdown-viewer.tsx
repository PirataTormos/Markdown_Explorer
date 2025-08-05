"use client"

import * as React from "react"
import { FileText, Calendar, HardDrive, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useMarkdownStore } from "@/lib/store"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface FileContent {
  content: string
  path: string
  size: number
  modified: string
}

// Simple code block component
function CodeBlock({ children, className, ...props }: any) {
  const language = className?.replace("language-", "") || "text"

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{language}</div>
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto border">
        <code className="text-sm font-mono" {...props}>
          {children}
        </code>
      </pre>
    </div>
  )
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
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  return !inline ? (
                    <CodeBlock className={className} {...props}>
                      {String(children).replace(/\n$/, "")}
                    </CodeBlock>
                  ) : (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                      {children}
                    </code>
                  )
                },
                img({ src, alt, ...props }) {
                  // Handle relative image paths
                  const imageSrc = src?.startsWith("/")
                    ? src
                    : `/api/content?path=${encodeURIComponent(content.path.replace(/[^/]+$/, "") + src)}`
                  return (
                    <img
                      src={imageSrc || "/placeholder.svg"}
                      alt={alt}
                      className="max-w-full h-auto rounded-lg shadow-sm"
                      {...props}
                    />
                  )
                },
                table({ children, ...props }) {
                  return (
                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full border-collapse border border-border rounded-lg" {...props}>
                        {children}
                      </table>
                    </div>
                  )
                },
                th({ children, ...props }) {
                  return (
                    <th className="border border-border px-4 py-2 bg-muted font-semibold text-left" {...props}>
                      {children}
                    </th>
                  )
                },
                td({ children, ...props }) {
                  return (
                    <td className="border border-border px-4 py-2" {...props}>
                      {children}
                    </td>
                  )
                },
                blockquote({ children, ...props }) {
                  return (
                    <blockquote
                      className="border-l-4 border-primary/20 pl-4 py-2 my-4 italic text-muted-foreground bg-muted/30 rounded-r"
                      {...props}
                    >
                      {children}
                    </blockquote>
                  )
                },
                h1({ children, ...props }) {
                  return (
                    <h1 className="text-3xl font-bold mt-8 mb-4 pb-2 border-b border-border" {...props}>
                      {children}
                    </h1>
                  )
                },
                h2({ children, ...props }) {
                  return (
                    <h2 className="text-2xl font-semibold mt-6 mb-3" {...props}>
                      {children}
                    </h2>
                  )
                },
                h3({ children, ...props }) {
                  return (
                    <h3 className="text-xl font-semibold mt-5 mb-2" {...props}>
                      {children}
                    </h3>
                  )
                },
                ul({ children, ...props }) {
                  return (
                    <ul className="list-disc list-inside space-y-1 my-4" {...props}>
                      {children}
                    </ul>
                  )
                },
                ol({ children, ...props }) {
                  return (
                    <ol className="list-decimal list-inside space-y-1 my-4" {...props}>
                      {children}
                    </ol>
                  )
                },
                li({ children, ...props }) {
                  return (
                    <li className="text-foreground" {...props}>
                      {children}
                    </li>
                  )
                },
                a({ children, href, ...props }) {
                  return (
                    <a
                      href={href}
                      className="text-primary hover:text-primary/80 underline underline-offset-2 hover:underline-offset-4 transition-all"
                      target={href?.startsWith("http") ? "_blank" : undefined}
                      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                      {...props}
                    >
                      {children}
                    </a>
                  )
                },
                hr({ ...props }) {
                  return <hr className="border-border my-8" {...props} />
                },
              }}
            >
              {content.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
