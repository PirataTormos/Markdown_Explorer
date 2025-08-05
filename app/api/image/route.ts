import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imagePath = searchParams.get("path")

    console.log("Image API called with path:", imagePath)

    if (!imagePath) {
      return NextResponse.json({ error: "Image path is required" }, { status: 400 })
    }

    // Security: Ensure the path is within the Markdowns directory
    const markdownsPath = path.join(process.cwd(), "Markdowns")
    const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath
    const fullPath = path.join(markdownsPath, cleanPath)

    console.log("Resolved image path:", fullPath)

    // Check if the resolved path is still within the Markdowns directory
    if (!fullPath.startsWith(markdownsPath)) {
      console.log("Invalid image path - outside Markdowns directory")
      return NextResponse.json({ error: "Invalid image path" }, { status: 403 })
    }

    // Check if path exists
    if (!fs.existsSync(fullPath)) {
      console.log("Image file not found:", fullPath)
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }

    // Check if it's actually a file (not a directory)
    const stats = fs.statSync(fullPath)
    if (!stats.isFile()) {
      console.log("Path is not a file:", fullPath)
      return NextResponse.json({ error: "Path is not a file" }, { status: 400 })
    }

    // Check if it's an image file
    const extension = path.extname(fullPath).toLowerCase()
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg"]

    if (!imageExtensions.includes(extension)) {
      console.log("File is not an image:", extension)
      return NextResponse.json({ error: "File is not an image" }, { status: 400 })
    }

    // Read the image file
    const imageBuffer = fs.readFileSync(fullPath)

    // Determine content type
    const contentTypeMap: { [key: string]: string } = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".bmp": "image/bmp",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
    }

    const contentType = contentTypeMap[extension] || "application/octet-stream"

    console.log("Serving image:", fullPath, "as", contentType)

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Image API Error:", error)

    // Handle specific EISDIR error
    if (error instanceof Error && error.message.includes("EISDIR")) {
      return NextResponse.json({ error: "Cannot read directory as image file" }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to serve image" }, { status: 500 })
  }
}
