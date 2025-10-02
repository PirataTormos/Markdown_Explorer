import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get("path")

    console.log("Content API called with path:", filePath)

    if (!filePath) {
      return NextResponse.json({ success: false, error: "File path is required" }, { status: 400 })
    }

    // Security: Ensure the path is within the Markdowns directory
    const markdownsPath = path.join(process.cwd(), "Markdowns")

    // Remove "Markdowns/" prefix if it exists in the path
    let cleanPath = filePath
    if (filePath.startsWith("Markdowns/") || filePath.startsWith("Markdowns\\")) {
      cleanPath = filePath.substring(10) // Remove "Markdowns/" or "Markdowns\"
    }

    const fullPath = path.join(markdownsPath, cleanPath)

    console.log("Markdowns path:", markdownsPath)
    console.log("Clean path:", cleanPath)
    console.log("Full path:", fullPath)

    // Check if the resolved path is still within the Markdowns directory
    if (!fullPath.startsWith(markdownsPath)) {
      console.error("Invalid path - outside Markdowns directory")
      return NextResponse.json({ success: false, error: "Invalid file path" }, { status: 403 })
    }

    if (!fs.existsSync(fullPath)) {
      console.error("File does not exist:", fullPath)

      // List available files for debugging
      try {
        const dir = path.dirname(fullPath)
        if (fs.existsSync(dir)) {
          const files = fs.readdirSync(dir)
          console.log("Available files in directory:", files)
        } else {
          console.log("Directory does not exist:", dir)
        }
      } catch (listError) {
        console.error("Error listing directory:", listError)
      }

      return NextResponse.json({ success: false, error: "File not found" }, { status: 404 })
    }

    const content = fs.readFileSync(fullPath, "utf-8")
    const stats = fs.statSync(fullPath)

    console.log("File loaded successfully:", cleanPath)

    return NextResponse.json({
      success: true,
      data: {
        content,
        path: cleanPath,
        size: stats.size,
        modified: stats.mtime.toISOString(),
      },
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: `Failed to read file content: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}
