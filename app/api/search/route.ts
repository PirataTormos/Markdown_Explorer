import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

interface SearchResult {
  name: string
  path: string
  matches: string[]
}

function searchInDirectory(dirPath: string, query: string, basePath = ""): SearchResult[] {
  const results: SearchResult[] = []

  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true })

    for (const item of items) {
      const fullPath = path.join(dirPath, item.name)
      const relativePath = path.join(basePath, item.name)

      if (item.isDirectory()) {
        results.push(...searchInDirectory(fullPath, query, relativePath))
      } else if (item.isFile()) {
        const extension = path.extname(item.name).toLowerCase()
        if ([".md", ".txt", ".mdx"].includes(extension)) {
          const matches: string[] = []

          // Search in filename
          if (item.name.toLowerCase().includes(query.toLowerCase())) {
            matches.push(`Filename: ${item.name}`)
          }

          // Search in content
          try {
            const content = fs.readFileSync(fullPath, "utf-8")
            const lines = content.split("\n")

            lines.forEach((line, index) => {
              if (line.toLowerCase().includes(query.toLowerCase())) {
                matches.push(`Line ${index + 1}: ${line.trim()}`)
              }
            })
          } catch (error) {
            console.error(`Error reading file ${fullPath}:`, error)
          }

          if (matches.length > 0) {
            results.push({
              name: item.name,
              path: relativePath,
              matches: matches.slice(0, 5), // Limit to 5 matches per file
            })
          }
        }
      }
    }
  } catch (error) {
    console.error("Error searching directory:", error)
  }

  return results
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ success: false, error: "Query must be at least 2 characters long" }, { status: 400 })
    }

    const markdownsPath = path.join(process.cwd(), "Markdowns")

    if (!fs.existsSync(markdownsPath)) {
      return NextResponse.json({
        success: true,
        data: [],
      })
    }

    const results = searchInDirectory(markdownsPath, query.trim())

    return NextResponse.json({
      success: true,
      data: results,
    })
  } catch (error) {
    console.error("Search API Error:", error)
    return NextResponse.json({ success: false, error: "Search failed" }, { status: 500 })
  }
}
