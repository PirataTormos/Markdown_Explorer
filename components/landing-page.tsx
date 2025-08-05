"use client"

import * as React from "react"
import { Search, FileText, Loader2, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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

  const renderSearchResults = () => {
    if (searchResults.length === 0) {
      return (
        <div className="p-8 text-center text-muted-foreground">
          {searching ? (
            <div>
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" />
              <p className="text-sm">Buscando...</p>
            </div>
          ) : searchQuery.length >= 2 ? (
            <div>
              <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No se encontraron resultados</p>
            </div>
          ) : (
            <div>
              <Search className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p className="text-sm">Escribe para buscar en la documentación</p>
            </div>
          )}
        </div>
      )
    }

    return (
      <div className="space-y-3 p-4">
        {searchResults.map((result) => (
          <div key={result.path} className="border rounded-lg p-4 hover:bg-accent/30 transition-colors">
            <Button
              variant="ghost"
              onClick={() => handleFileSelect(result.path)}
              className="w-full justify-start p-0 h-auto"
            >
              <div className="flex items-center gap-3 w-full">
                <FileText className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div className="text-left flex-1 min-w-0">
                  <p className="font-medium text-base truncate">{result.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{result.path}</p>
                </div>
              </div>
            </Button>
            {result.matches.length > 0 && (
              <div className="mt-3 pl-8">
                <p className="text-xs text-muted-foreground mb-2">Coincidencias:</p>
                {result.matches.slice(0, 3).map((match, index) => (
                  <p key={index} className="text-sm bg-muted/50 rounded px-3 py-2 mb-2 truncate">
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
    <div className="min-h-full flex items-center justify-center bg-background">
      <div className="w-full max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Frik-E3D
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">Buscador de documentación E3D</p>
        </div>

        {/* Search Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-xl">Buscar en documentación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar archivos, contenido, funciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg border-2 focus:border-primary/50"
                />
                {searching && (
                  <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 animate-spin text-primary" />
                )}
              </div>

              <div className="max-h-96 overflow-y-auto rounded-lg border">{renderSearchResults()}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
