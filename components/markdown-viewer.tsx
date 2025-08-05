"use client"

import * as React from "react"
import { FileText, Calendar, HardDrive, Loader2, ImageIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useMarkdownStore } from "@/lib/store"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { CustomSyntaxHighlighter } from "./syntax-highlighter"
import type { JSX } from "react/jsx-runtime"

interface FileContent {
  content: string
  path: string
  size: number
  modified: string
}

// Componente personalizado para imágenes
const ImageComponent = ({ src, alt, filePath }: { src?: string; alt?: string; filePath: string }) => {
  const [imageError, setImageError] = React.useState(false)
  const [imageLoading, setImageLoading] = React.useState(true)

  if (!src) {
    return (
      <div className="my-6 text-center p-4 border border-dashed border-border rounded-lg">
        <div className="text-muted-foreground">
          <ImageIcon className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">No image source provided</p>
        </div>
      </div>
    )
  }

  // Skip external URLs - just display them normally
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return (
      <div className="my-6 text-center">
        <img
          src={src || "/placeholder.svg"}
          alt={alt || ""}
          className="max-w-full h-auto rounded-lg shadow-lg mx-auto border border-border/20"
          onError={() => setImageError(true)}
        />
        {alt && <p className="text-sm text-muted-foreground mt-3 italic font-medium">{alt}</p>}
      </div>
    )
  }

  // Handle relative paths
  let imageSrc = src
  if (!src.startsWith("/")) {
    // Get the directory of the current file
    const fileDir = filePath.substring(0, filePath.lastIndexOf("/"))
    imageSrc = fileDir ? `${fileDir}/${src}` : src
  }

  const imageUrl = `/api/image?path=${encodeURIComponent(imageSrc)}`

  if (imageError) {
    return (
      <div className="my-6 text-center p-4 border border-dashed border-border rounded-lg">
        <div className="text-muted-foreground">
          <ImageIcon className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">Image not found: {src}</p>
          {alt && <p className="text-xs mt-1 italic">{alt}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="my-6 text-center">
      {imageLoading && (
        <div className="flex items-center justify-center p-8 border border-dashed border-border rounded-lg">
          <div className="text-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading image...</p>
          </div>
        </div>
      )}
      <img
        src={imageUrl || "/placeholder.svg"}
        alt={alt || ""}
        className={`max-w-full h-auto rounded-lg shadow-lg mx-auto border border-border/20 ${
          imageLoading ? "hidden" : "block"
        }`}
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageError(true)
          setImageLoading(false)
        }}
      />
      {alt && !imageError && !imageLoading && (
        <p className="text-sm text-muted-foreground mt-3 italic font-medium">{alt}</p>
      )}
    </div>
  )
}

// Componente personalizado para código
const CodeComponent = ({
  inline,
  className,
  children,
  ...props
}: {
  inline?: boolean
  className?: string
  children?: React.ReactNode
}) => {
  const match = /language-(\w+)/.exec(className || "")
  const language = match ? match[1] : "text"

  if (inline) {
    return (
      <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-foreground border border-border/30" {...props}>
        {children}
      </code>
    )
  }

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-border/30 shadow-sm">
      {language !== "text" && (
        <div className="bg-muted px-4 py-2 text-xs font-medium text-muted-foreground border-b border-border/30 flex items-center justify-between">
          <span className="uppercase tracking-wide">{language}</span>
          <span className="text-xs opacity-60">Code</span>
        </div>
      )}
      <CustomSyntaxHighlighter language={language}>{String(children).replace(/\n$/, "")}</CustomSyntaxHighlighter>
    </div>
  )
}

// Componente personalizado para blockquotes
const BlockquoteComponent = ({ children }: { children?: React.ReactNode }) => (
  <blockquote className="border-l-4 border-primary/30 pl-6 py-4 my-6 bg-muted/30 rounded-r-lg italic text-muted-foreground">
    <div className="text-base leading-relaxed">{children}</div>
  </blockquote>
)

// Componente personalizado para tablas
const TableComponent = ({ children }: { children?: React.ReactNode }) => (
  <div className="my-6 overflow-x-auto rounded-lg border border-border shadow-sm">
    <table className="w-full border-collapse bg-card">{children}</table>
  </div>
)

const TableHeaderComponent = ({ children }: { children?: React.ReactNode }) => (
  <thead className="bg-muted/50">{children}</thead>
)

const TableRowComponent = ({ children }: { children?: React.ReactNode }) => (
  <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">{children}</tr>
)

const TableCellComponent = ({ children }: { children?: React.ReactNode }) => (
  <td className="px-4 py-3 text-sm border-r border-border/30 last:border-r-0">{children}</td>
)

const TableHeaderCellComponent = ({ children }: { children?: React.ReactNode }) => (
  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground border-r border-border/30 last:border-r-0">
    {children}
  </th>
)

// Componente personalizado para listas
const ListComponent = ({ ordered, children }: { ordered?: boolean; children?: React.ReactNode }) => {
  const Component = ordered ? "ol" : "ul"
  return (
    <Component className={`my-4 space-y-2 ${ordered ? "list-decimal" : "list-disc"} list-inside pl-4`}>
      {children}
    </Component>
  )
}

const ListItemComponent = ({ children }: { children?: React.ReactNode }) => (
  <li className="text-foreground leading-relaxed pl-2">{children}</li>
)

// Componente personalizado para headings
const HeadingComponent = ({ level, children }: { level: number; children?: React.ReactNode }) => {
  const Component = `h${level}` as keyof JSX.IntrinsicElements
  const styles = {
    1: "text-3xl font-bold mt-8 mb-4 pb-3 border-b-2 border-border text-foreground",
    2: "text-2xl font-semibold mt-6 mb-3 text-foreground",
    3: "text-xl font-semibold mt-5 mb-2 text-foreground",
    4: "text-lg font-medium mt-4 mb-2 text-foreground",
    5: "text-base font-medium mt-3 mb-1 text-foreground",
    6: "text-sm font-medium mt-2 mb-1 text-foreground",
  }

  return <Component className={styles[level as keyof typeof styles] || styles[6]}>{children}</Component>
}

// Componente personalizado para párrafos
const ParagraphComponent = ({ children }: { children?: React.ReactNode }) => (
  <p className="mb-4 leading-relaxed text-foreground">{children}</p>
)

// Componente personalizado para enlaces
const LinkComponent = ({ href, children }: { href?: string; children?: React.ReactNode }) => (
  <a
    href={href}
    className="text-primary hover:text-primary/80 underline underline-offset-2 hover:underline-offset-4 transition-all font-medium"
    target={href?.startsWith("http") ? "_blank" : undefined}
    rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
  >
    {children}
  </a>
)

// Componente personalizado para líneas horizontales
const HrComponent = () => <hr className="my-8 border-border border-t-2" />

function EnhancedMarkdownRenderer({ content, filePath }: { content: string; filePath: string }) {
  return (
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ src, alt }) => <ImageComponent src={src || "/placeholder.svg"} alt={alt} filePath={filePath} />,
          code: CodeComponent,
          blockquote: BlockquoteComponent,
          table: TableComponent,
          thead: TableHeaderComponent,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: TableRowComponent,
          td: TableCellComponent,
          th: TableHeaderCellComponent,
          ul: ({ children }) => <ListComponent ordered={false}>{children}</ListComponent>,
          ol: ({ children }) => <ListComponent ordered={true}>{children}</ListComponent>,
          li: ListItemComponent,
          h1: ({ children }) => <HeadingComponent level={1}>{children}</HeadingComponent>,
          h2: ({ children }) => <HeadingComponent level={2}>{children}</HeadingComponent>,
          h3: ({ children }) => <HeadingComponent level={3}>{children}</HeadingComponent>,
          h4: ({ children }) => <HeadingComponent level={4}>{children}</HeadingComponent>,
          h5: ({ children }) => <HeadingComponent level={5}>{children}</HeadingComponent>,
          h6: ({ children }) => <HeadingComponent level={6}>{children}</HeadingComponent>,
          p: ParagraphComponent,
          a: LinkComponent,
          hr: HrComponent,
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          em: ({ children }) => <em className="italic text-foreground">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
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
        <CardContent className="p-8">
          <EnhancedMarkdownRenderer content={content.content} filePath={content.path} />
        </CardContent>
      </Card>
    </div>
  )
}
