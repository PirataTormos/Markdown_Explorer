import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get("path")

    if (!filePath) {
      return NextResponse.json({ success: false, error: "File path is required" }, { status: 400 })
    }

    // Security: Ensure the path is within the Markdowns directory
    const markdownsPath = path.join(process.cwd(), "Markdowns")
    const fullPath = path.join(markdownsPath, filePath)

    // Check if the resolved path is still within the Markdowns directory
    if (!fullPath.startsWith(markdownsPath)) {
      return NextResponse.json({ success: false, error: "Invalid file path" }, { status: 403 })
    }

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ success: false, error: "File not found" }, { status: 404 })
    }

    const content = fs.readFileSync(fullPath, "utf-8")
    const stats = fs.statSync(fullPath)

    return NextResponse.json({
      success: true,
      data: {
        content,
        path: filePath,
        size: stats.size,
        modified: stats.mtime.toISOString(),
      },
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to read file content" }, { status: 500 })
  }
}
