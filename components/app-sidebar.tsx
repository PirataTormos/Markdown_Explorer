"use client"

import * as React from "react"
import { Search, FileText, Folder, FolderOpen, Loader2, RefreshCw, AlertCircle, FolderOpenIcon } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useMarkdownStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

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

export function AppSidebar() {
  const [files, setFiles] = React.useState<FileNode[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([])
  const [searching, setSearching] = React.useState(false)
  const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(new Set())

  const [maxNestingLevel, setMaxNestingLevel] = React.useState(0)


  const { setCurrentFile, currentFile } = useMarkdownStore()
  const { toast } = useToast()

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
      setError(null)

      console.log("Loading files from API...")

      const response = await fetch("/api/files")
      console.log("Response status:", response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("API Response:", data)

      if (data.success) {
        setFiles(data.data)
        console.log("Files loaded successfully:", data.data.length, "items")
      } else {
        setError(data.error || "Failed to load files")
        console.error("API returned error:", data.error)
      }
    } catch (error) {
      console.error("Error loading files:", error)
      setError(error instanceof Error ? error.message : "Failed to load files")
    } finally {
      setLoading(false)
    }
  }

  const performSearch = async (query: string) => {
    try {
      setSearching(true)
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setSearchResults(data.data)
      } else {
        console.error("Search error:", data.error)
        setSearchResults([])
      }
    } catch (error) {
      console.error("Error searching:", error)
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  const handleOpenFolder = async () => {
    try {
      setOpeningFolder(true)

      const response = await fetch("/api/open-folder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Explorador abierto",
          description: `Se abrió el explorador en: ${data.path}`,
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "No se pudo abrir el explorador",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error opening folder:", error)
      toast({
        title: "Error",
        description: "No se pudo abrir el explorador de archivos",
        variant: "destructive",
      })
    } finally {
      setOpeningFolder(false)
    }
  }

  const handleFileSelect = (filePath: string) => {
    console.log("File selected:", filePath)
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

  const calculateMaxNestingLevel = React.useCallback(
    (nodes: FileNode[], currentLevel = 0): number => {
      let maxLevel = currentLevel

      for (const node of nodes) {
        if (node.type === "directory" && expandedFolders.has(node.path) && node.children) {
          const childLevel = calculateMaxNestingLevel(node.children, currentLevel + 1)
          maxLevel = Math.max(maxLevel, childLevel)
        }
      }

      return maxLevel
    },
    [expandedFolders],
  )

  React.useEffect(() => {
    const newMaxLevel = calculateMaxNestingLevel(files)
    setMaxNestingLevel(newMaxLevel)
  }, [expandedFolders, files, calculateMaxNestingLevel])

  const renderFileTree = (nodes: FileNode[], level = 0) => {
    if (!nodes || nodes.length === 0) {
      return <div className="p-4 text-sm text-muted-foreground text-center">No files found</div>
    }

    return nodes.map((node) => {
      if (node.type === "directory") {
        const isExpanded = expandedFolders.has(node.path)

        return (
          <SidebarMenuItem key={node.path}>
            <Collapsible open={isExpanded} onOpenChange={() => toggleFolder(node.path)}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  className="justify-start min-h-8 h-auto py-2 flex-1"
                  style={{ paddingLeft: `${level * 16 + 8}px` }}
                >
                  {isExpanded ? <FolderOpen className="h-4 w-4 shrink-0" /> : <Folder className="h-4 w-4 shrink-0" />}
                  <span className="ml-2 text-left leading-tight flex-1 break-words">{node.name}</span>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>{node.children && renderFileTree(node.children, level + 1)}</SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
        )
      } else {
        return (
          <SidebarMenuItem key={node.path}>
            <SidebarMenuButton
              onClick={() => handleFileSelect(node.path)}
              isActive={currentFile === node.path}
              className="justify-start min-h-8 h-auto py-2 flex-1"
              style={{ paddingLeft: `${level * 16 + 8}px` }}
            >
              <FileText className="h-4 w-4 shrink-0" />
              <span className="ml-2 text-left leading-tight flex-1 break-words">{node.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      }
    })
  }

  const renderSearchResults = () => {
    if (searchResults.length === 0) {
      return (
        <div className="p-4 text-sm text-muted-foreground">
          {searching ? "Searching..." : searchQuery.length >= 2 ? "No results found" : ""}
        </div>
      )
    }

    return searchResults.map((result) => (
      <SidebarMenuItem key={result.path}>
        <SidebarMenuButton
          onClick={() => handleFileSelect(result.path)}
          isActive={currentFile === result.path}
          className="justify-start min-h-8 h-auto py-2 flex-1"
        >
          <FileText className="h-4 w-4 shrink-0" />
          <span className="ml-2 text-left leading-tight flex-1 break-words">{result.name}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ))
  }

  const sidebarWidth = Math.max(280, 280 + maxNestingLevel * 40)

  return (
    <Sidebar style={{ width: `${sidebarWidth}px` }} className="transition-all duration-300 ease-in-out">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          {searching && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>
        <div className="flex gap-2">
          <Button onClick={loadFiles} variant="outline" size="sm" className="flex-1 bg-transparent" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </>
            )}
          </Button>
          <Button
            onClick={handleOpenFolder}
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent"
            disabled={openingFolder}
            title="Abrir carpeta en explorador"
          >
            {openingFolder ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Abriendo...
              </>
            ) : (
              <>
                <FolderOpenIcon className="h-4 w-4 mr-2" />
                Explorar
              </>
            )}
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {error ? (
          <SidebarGroup>
            <SidebarGroupLabel>Error</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="p-4 text-center">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm text-red-600 mb-3">{error}</p>
                <Button onClick={loadFiles} size="sm" variant="outline">
                  Try Again
                </Button>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : searchQuery.trim().length >= 2 ? (
          <SidebarGroup>
            <SidebarGroupLabel>Search Results</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderSearchResults()}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          <SidebarGroup>
            <SidebarGroupLabel>Files</SidebarGroupLabel>
            <SidebarGroupContent>
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    <span className="text-sm text-muted-foreground">Loading files...</span>
                  </div>
                </div>
              ) : (
                <SidebarMenu>{renderFileTree(files)}</SidebarMenu>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
