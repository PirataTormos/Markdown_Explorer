"use client"

import * as React from "react"
import { Search, FileText, Folder, FolderOpen, Loader2, BookOpen, Zap, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useMarkdownStore } from "@/lib/store"

interface FileNode {
  name: string
  path: string
  type: "file" | "directory"
  children?: FileNode[]
  extension?: string
}

interface SearchResult {
  name: string
  path: string
  matches: string[]
}

export function LandingPage() {
  const [files, setFiles] = React.useState<FileNode[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([])
  const [searching, setSearching] = React.useState(false)
  const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(new Set())

  const { setCurrentFile } = useMarkdownStore()

  React.useEffect(() => {
    loadFiles()
  }, [])

  React.useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch(searchQuery)
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(delayedSearch)
  }, [searchQuery])

  const loadFiles = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/files")
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const data = await response.json()
      if (data.success) {
        setFiles(data.data)
      }
    } catch (error) {
      console.error("Error loading files:", error)
    } finally {
      setLoading(false)
    }
  }

  const performSearch = async (query: string) => {
    try {
      setSearching(true)
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error(`Search failed: ${response.status}`)

      const data = await response.json()
      if (data.success) {
        setSearchResults(data.data)
      }
    } catch (error) {
      console.error("Error searching:", error)
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  const handleFileSelect = (filePath: string) => {
    setCurrentFile(filePath)
  }

  const toggleFolder = (folderPath: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath)
    } else {
      newExpanded.add(folderPath)
    }
    setExpandedFolders(newExpanded)
  }

  const renderFileTree = (nodes: FileNode[], level = 0) => {
    if (!nodes || nodes.length === 0) {
      return (
        <div className="p-4 text-center text-muted-foreground">
          <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No hay archivos disponibles</p>
        </div>
      )
    }

    return (
      <div className="space-y-1">
        {nodes.map((node) => {
          if (node.type === "directory") {
            const isExpanded = expandedFolders.has(node.path)
            return (
              <div key={node.path}>
                <Collapsible open={isExpanded} onOpenChange={() => toggleFolder(node.path)}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-8 px-2 hover:bg-accent/50"
                      style={{ paddingLeft: `${level * 16 + 8}px` }}
                    >
                      {isExpanded ? (
                        <FolderOpen className="h-4 w-4 mr-2 text-blue-500" />
                      ) : (
                        <Folder className="h-4 w-4 mr-2 text-blue-500" />
                      )}
                      <span className="text-sm font-medium">{node.name}</span>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>{node.children && renderFileTree(node.children, level + 1)}</CollapsibleContent>
                </Collapsible>
              </div>
            )
          } else {
            return (
              <Button
                key={node.path}
                variant="ghost"
                onClick={() => handleFileSelect(node.path)}
                className="w-full justify-start h-8 px-2 hover:bg-accent/50 text-left"
                style={{ paddingLeft: `${level * 16 + 8}px` }}
              >
                <FileText className="h-4 w-4 mr-2 text-green-600" />
                <span className="text-sm truncate">{node.name}</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {node.extension?.replace(".", "").toUpperCase()}
                </Badge>
              </Button>
            )
          }
        })}
      </div>
    )
  }

  const renderSearchResults = () => {
    if (searchResults.length === 0) {
      return (
        <div className="p-4 text-center text-muted-foreground">
          {searching ? (
            <div>
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p className="text-sm">Buscando...</p>
            </div>
          ) : searchQuery.length >= 2 ? (
            <div>
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No se encontraron resultados</p>
            </div>
          ) : null}
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {searchResults.map((result) => (
          <div key={result.path} className="border rounded-lg p-3 hover:bg-accent/30 transition-colors">
            <Button
              variant="ghost"
              onClick={() => handleFileSelect(result.path)}
              className="w-full justify-start p-0 h-auto"
            >
              <div className="flex items-center gap-2 w-full">
                <FileText className="h-4 w-4 text-green-600 flex-shrink-0" />
                <div className="text-left flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{result.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{result.path}</p>
                </div>
              </div>
            </Button>
            {result.matches.length > 0 && (
              <div className="mt-2 pl-6">
                <p className="text-xs text-muted-foreground mb-1">Coincidencias encontradas:</p>
                {result.matches.slice(0, 2).map((match, index) => (
                  <p key={index} className="text-xs bg-muted/50 rounded px-2 py-1 mb-1 truncate">
                    {match}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Frik-E3D
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-2 max-w-2xl mx-auto">
            Explorador y lector de documentos Markdown con interfaz moderna e intuitiva
          </p>
          <p className="text-sm text-muted-foreground/80 max-w-xl mx-auto">
            Navega, busca y visualiza tu documentación técnica de forma eficiente y elegante
          </p>
        </div>

        {/* Features Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg">Búsqueda Avanzada</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Encuentra rápidamente cualquier documento o contenido específico dentro de tu colección
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-lg">Renderizado Rápido</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Visualización instantánea de Markdown con soporte completo para código y tablas
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-lg">Navegación Intuitiva</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Explora tu estructura de archivos de manera organizada y eficiente
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Explorer Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* File Explorer */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="h-5 w-5 text-blue-500" />
                Explorador de Archivos
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Navega por tu estructura de documentos y selecciona archivos para visualizar
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto border-t">
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-primary" />
                      <p className="text-sm text-muted-foreground">Cargando archivos...</p>
                    </div>
                  </div>
                ) : (
                  renderFileTree(files)
                )}
              </div>
            </CardContent>
          </Card>

          {/* Search Section */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-green-500" />
                Buscador de Documentación E3D
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Encuentra información específica en toda tu documentación técnica de E3D. Busca por nombres de archivo,
                contenido, funciones o cualquier término relevante.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar en documentación E3D..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 border-2 focus:border-primary/50"
                  />
                  {searching && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {searchQuery.trim().length >= 2 ? (
                    renderSearchResults()
                  ) : (
                    <div className="text-center p-6 text-muted-foreground">
                      <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">Escribe al menos 2 caracteres para comenzar la búsqueda</p>
                      <p className="text-xs mt-1 opacity-70">
                        Busca por nombres de archivo, contenido, código o documentación
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Start Guide */}
        <Card className="mt-8 border-0 shadow-md bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">¿Cómo empezar?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Selecciona un archivo del explorador o usa el buscador para encontrar documentación específica
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  📁 Explora carpetas
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  🔍 Busca contenido
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  📖 Lee documentación
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  🌙 Modo oscuro/claro
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
