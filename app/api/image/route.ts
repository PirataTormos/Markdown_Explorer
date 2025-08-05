import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imagePath = searchParams.get("path")

    console.log("Image API called with path:", imagePath)

    if (!imagePath) {
      console.log("No image path provided")
      return NextResponse.json({ error: "Image path is required" }, { status: 400 })
    }

    // Clean the path - remove leading slashes and normalize
    const cleanPath = imagePath.replace(/^\/+/, "").replace(/\\/g, "/")
    console.log("Cleaned path:", cleanPath)

    // Security: Ensure the path is within the Markdowns directory
    const markdownsPath = path.resolve(process.cwd(), "Markdowns")
    const fullPath = path.resolve(markdownsPath, cleanPath)

    console.log("Markdowns path:", markdownsPath)
    console.log("Full resolved path:", fullPath)

    // Check if the resolved path is still within the Markdowns directory
    if (!fullPath.startsWith(markdownsPath)) {
      console.log("Security violation: path outside Markdowns directory")
      return NextResponse.json({ error: "Invalid image path - outside allowed directory" }, { status: 403 })
    }

    // Check if path exists
    if (!fs.existsSync(fullPath)) {
      console.log("File does not exist:", fullPath)
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }

    // Get file stats to check if it's a file
    let stats
    try {
      stats = fs.statSync(fullPath)
    } catch (statError) {
      console.log("Error getting file stats:", statError)
      return NextResponse.json({ error: "Cannot access file" }, { status: 500 })
    }

    // Check if it's actually a file (not a directory)
    if (!stats.isFile()) {
      console.log("Path is not a file (might be directory):", fullPath)
      return NextResponse.json({ error: "Path is not a file" }, { status: 400 })
    }

    // Check if it's an image file by extension
    const extension = path.extname(fullPath).toLowerCase()
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg"]

    if (!imageExtensions.includes(extension)) {
      console.log("File is not an image, extension:", extension)
      return NextResponse.json({ error: "File is not an image" }, { status: 400 })
    }

    // Try to read the image file
    let imageBuffer
    try {
      imageBuffer = fs.readFileSync(fullPath)
      console.log("Successfully read image file, size:", imageBuffer.length, "bytes")
    } catch (readError) {
      console.log("Error reading image file:", readError)
      if (readError instanceof Error && readError.message.includes("EISDIR")) {
        return NextResponse.json({ error: "Cannot read directory as image file" }, { status: 400 })
      }
      return NextResponse.json({ error: "Failed to read image file" }, { status: 500 })
    }

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

    console.log("Serving image successfully:", fullPath, "as", contentType)

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

    return NextResponse.json(
      {
        error: "Failed to serve image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
