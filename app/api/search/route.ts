import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

interface SearchResult {
  name: string
  path: string
  matches: string[]
}

function searchFiles(dirPath: string, query: string, basePath = ""): SearchResult[] {
  const results: SearchResult[] = []
  const lowerQuery = query.toLowerCase()

  try {
    if (!fs.existsSync(dirPath)) {
      return []
    }

    const items = fs.readdirSync(dirPath)

    for (const item of items) {
      if (item.startsWith(".")) continue

      const fullPath = path.join(dirPath, item)
      const relativePath = basePath ? path.join(basePath, item).replace(/\\/g, "/") : item
      const stats = fs.statSync(fullPath)

      if (stats.isDirectory()) {
        // Recursively search in subdirectories
        const subResults = searchFiles(fullPath, query, relativePath)
        results.push(...subResults)
      } else if (stats.isFile()) {
        const extension = path.extname(item).toLowerCase()
        if (![".md", ".txt", ".mdx"].includes(extension)) continue

        // Check if filename matches
        const nameMatches = item.toLowerCase().includes(lowerQuery)

        // Check if content matches
        let contentMatches = false
        const matches: string[] = []

        try {
          const content = fs.readFileSync(fullPath, "utf-8")
          const lines = content.split("\n")

          for (let i = 0; i < lines.length; i++) {
            if (lines[i].toLowerCase().includes(lowerQuery)) {
              contentMatches = true
              // Get context (line with match, limited to 100 chars)
              const matchLine = lines[i].substring(0, 100)
              matches.push(`Line ${i + 1}: ${matchLine}`)

              // Limit to 3 matches per file
              if (matches.length >= 3) break
            }
          }
        } catch (readError) {
          console.error(`Error reading file ${fullPath}:`, readError)
        }

        if (nameMatches || contentMatches) {
          results.push({
            name: item,
            path: relativePath,
            matches: matches.length > 0 ? matches : ["Filename match"],
          })
        }
      }
    }
  } catch (error) {
    console.error(`Error searching directory ${dirPath}:`, error)
  }

  return results
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    console.log("Search API called with query:", query)

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: false,
        error: "Query must be at least 2 characters long",
      })
    }

    const markdownsPath = path.join(process.cwd(), "Markdowns")

    if (!fs.existsSync(markdownsPath)) {
      return NextResponse.json({
        success: true,
        data: [],
      })
    }

    const results = searchFiles(markdownsPath, query.trim())
    console.log(`Search completed. Found ${results.length} results`)

    return NextResponse.json({
      success: true,
      data: results,
    })
  } catch (error) {
    console.error("Search API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: `Search failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}
