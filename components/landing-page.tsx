"use client"

import * as React from "react"
import { Search, FileText, Loader2 } from "lucide-react"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <h1 className="text-7xl font-black tracking-tight bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
              FRIK-E3D
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 rounded-lg blur opacity-20 animate-pulse"></div>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-300 font-medium">
            Documentación E3D al alcance de tus dedos
          </p>
        </div>

        {/* Search Container */}
        <div className="relative">
          {/* Search Input */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-4 px-4 py-4">
                <Search className="h-6 w-6 text-slate-400 flex-shrink-0" />
                <Input
                  placeholder="Buscar en documentación E3D..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent text-lg placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                />
                {searching && <Loader2 className="h-6 w-6 animate-spin text-violet-500 flex-shrink-0" />}
              </div>
            </div>
          </div>

          {/* Results */}
          {(searchQuery.length >= 2 || searchResults.length > 0) && (
            <div className="mt-4 relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-2xl blur opacity-20"></div>
              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 max-h-96 overflow-hidden">
                {searchResults.length === 0 ? (
                  <div className="p-12 text-center">
                    {searching ? (
                      <div className="space-y-3">
                        <Loader2 className="h-12 w-12 animate-spin mx-auto text-violet-500" />
                        <p className="text-slate-500 dark:text-slate-400">Buscando...</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center">
                          <Search className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400">
                          {searchQuery.length >= 2 ? "No se encontraron resultados" : "Comienza a escribir para buscar"}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="overflow-y-auto max-h-96">
                    {searchResults.map((result, index) => (
                      <div key={result.path} className="group">
                        <Button
                          variant="ghost"
                          onClick={() => handleFileSelect(result.path)}
                          className="w-full p-6 h-auto justify-start hover:bg-gradient-to-r hover:from-violet-50 hover:to-cyan-50 dark:hover:from-violet-950/50 dark:hover:to-cyan-950/50 transition-all duration-200"
                        >
                          <div className="flex items-start gap-4 w-full">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                              <FileText className="h-5 w-5 text-white" />
                            </div>
                            <div className="text-left flex-1 min-w-0">
                              <p className="font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                {result.name}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-1">{result.path}</p>
                              {result.matches.length > 0 && (
                                <div className="mt-3 space-y-1">
                                  {result.matches.slice(0, 2).map((match, matchIndex) => (
                                    <div
                                      key={matchIndex}
                                      className="text-xs bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-300 truncate"
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
                          <div className="mx-6 border-b border-slate-200 dark:border-slate-700"></div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
