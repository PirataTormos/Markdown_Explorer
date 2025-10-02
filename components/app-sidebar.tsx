"use client"

import * as React from "react"
import { Search, FileText, Folder, FolderOpen, Loader2, RefreshCw, AlertCircle } from "lucide-react"
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

  const { setCurrentFile, currentFile } = useMarkdownStore()

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

  const maxDepth = React.useMemo(() => {
    const getDepth = (nodes: FileNode[], currentDepth = 0): number => {
      let maxDepth = currentDepth
      for (const node of nodes) {
        if (node.type === "directory" && expandedFolders.has(node.path) && node.children) {
          const childDepth = getDepth(node.children, currentDepth + 1)
          maxDepth = Math.max(maxDepth, childDepth)
        }
      }
      return maxDepth
    }
    return getDepth(files)
  }, [files, expandedFolders])

  const loadFiles = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Loading files from API...")

      const response = await fetch("/api/files", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error Response:", errorText)
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("API Response:", data)

      if (data.success) {
        setFiles(data.data || [])
        console.log("Files loaded successfully:", (data.data || []).length, "items")
      } else {
        setError(data.error || "Failed to load files")
        console.error("API returned error:", data.error)
      }
    } catch (error) {
      console.error("Error loading files:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to load files"
      setError(errorMessage)
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
                <SidebarMenuButton className="w-full justify-start">
                  {isExpanded ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
                  <span>{node.name}</span>
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
              className="w-full justify-start"
            >
              <FileText className="h-4 w-4" />
              <span>{node.name}</span>
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
          className="w-full justify-start"
        >
          <FileText className="h-4 w-4" />
          <span>{result.name}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ))
  }

  const sidebarWidth = `${16 + maxDepth * 3}rem`

  return (
    <Sidebar style={{ "--sidebar-width": sidebarWidth } as React.CSSProperties}>
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
        <Button onClick={loadFiles} variant="outline" size="sm" className="w-full bg-transparent" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Files
            </>
          )}
        </Button>
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
