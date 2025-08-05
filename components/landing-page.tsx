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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <h1 className="text-7xl font-black tracking-tight bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 dark:from-gray-200 dark:via-gray-300 dark:to-gray-400 bg-clip-text text-transparent">
              FRIK-E3D
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-400 to-gray-500 rounded-lg blur opacity-10 animate-pulse"></div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">
            Documentación E3D al alcance de tus dedos
          </p>
        </div>

        {/* Search Container */}
        <div className="relative">
          {/* Search Input */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-2 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="flex items-center gap-4 px-4 py-4">
                <Search className="h-6 w-6 text-gray-400 flex-shrink-0" />
                <Input
                  placeholder="Buscar en documentación E3D..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent text-lg placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                />
                {searching && <Loader2 className="h-6 w-6 animate-spin text-gray-500 flex-shrink-0" />}
              </div>
            </div>
          </div>

          {/* Results */}
          {(searchQuery.length >= 2 || searchResults.length > 0) && (
            <div className="mt-4 relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded-2xl blur opacity-15"></div>
              <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 max-h-96 overflow-hidden shadow-lg">
                {searchResults.length === 0 ? (
                  <div className="p-12 text-center">
                    {searching ? (
                      <div className="space-y-3">
                        <Loader2 className="h-12 w-12 animate-spin mx-auto text-gray-500" />
                        <p className="text-gray-500 dark:text-gray-400">Buscando...</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center">
                          <Search className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">
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
                          className="w-full p-6 h-auto justify-start hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200"
                        >
                          <div className="flex items-start gap-4 w-full">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center flex-shrink-0">
                              <FileText className="h-5 w-5 text-white" />
                            </div>
                            <div className="text-left flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                                {result.name}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">{result.path}</p>
                              {result.matches.length > 0 && (
                                <div className="mt-3 space-y-1">
                                  {result.matches.slice(0, 2).map((match, matchIndex) => (
                                    <div
                                      key={matchIndex}
                                      className="text-xs bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 text-gray-600 dark:text-gray-300 truncate"
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
                          <div className="mx-6 border-b border-gray-200 dark:border-gray-700"></div>
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
