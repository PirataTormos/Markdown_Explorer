"use client"

import * as React from "react"
import { Search, FileText, Loader2, FolderOpen, Copy } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useMarkdownStore } from "@/lib/store"

interface SearchResult {
  name: string
  path: string
  matches: string[]
}

export function LandingPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([])
  const [searching, setSearching] = React.useState(false)

  const { setCurrentFile } = useMarkdownStore()

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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center p-8">
      <div className="w-full max-w-3xl mx-auto">
        {/* Badge */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="text-sm font-medium px-4 py-2 rounded-full">
            📄 Explorador de Documentación E3D
          </Badge>
        </div>

        {/* Main Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Explora tus documentos
            <br />
            de manera inteligente
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Busca, navega y visualiza tus archivos Markdown con una interfaz moderna y búsqueda conceptual avanzada.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              placeholder="Busca por conceptos, títulos, contenido... ej: 'configuración API', 'tutorial React'"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-6 text-lg border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 transition-colors"
            />
            {searching && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            )}
          </div>

          {/* Search Results */}
          {searchQuery.length >= 2 && (
            <div className="mt-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg overflow-hidden">
              {searchResults.length === 0 ? (
                <div className="p-8 text-center">
                  {searching ? (
                    <div className="space-y-3">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                      <p className="text-gray-500 dark:text-gray-400">Buscando...</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Search className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">No se encontraron resultados</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <div key={result.path}>
                      <Button
                        variant="ghost"
                        onClick={() => handleFileSelect(result.path)}
                        className="w-full p-6 h-auto justify-start hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-start gap-4 w-full">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">{result.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">{result.path}</p>
                            {result.matches.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {result.matches.slice(0, 2).map((match, matchIndex) => (
                                  <div
                                    key={matchIndex}
                                    className="text-xs bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 text-gray-600 dark:text-gray-300"
                                  >
                                    {match}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </Button>
                      {index < searchResults.length - 1 && (
                        <div className="border-b border-gray-100 dark:border-gray-800"></div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-xl text-base font-medium"
            onClick={() => {
              // Trigger sidebar or file explorer
              document.querySelector('[data-sidebar="trigger"]')?.click?.()
            }}
          >
            <FolderOpen className="h-5 w-5 mr-2" />
            Abrir Explorador de Archivos
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-gray-200 dark:border-gray-800 px-8 py-4 rounded-xl text-base font-medium bg-transparent"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
            }}
          >
            <Copy className="h-5 w-5 mr-2" />
            Copiar Enlace
          </Button>
        </div>
      </div>
    </div>
  )
}
