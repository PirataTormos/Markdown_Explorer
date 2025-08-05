import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imagePath = searchParams.get("path")

    if (!imagePath) {
      return NextResponse.json({ error: "Image path is required" }, { status: 400 })
    }

    // Security: Ensure the path is within the Markdowns directory
    const markdownsPath = path.join(process.cwd(), "Markdowns")
    const fullPath = path.join(markdownsPath, imagePath.startsWith("/") ? imagePath.slice(1) : imagePath)

    // Check if the resolved path is still within the Markdowns directory
    if (!fullPath.startsWith(markdownsPath)) {
      return NextResponse.json({ error: "Invalid image path" }, { status: 403 })
    }

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }

    // Check if it's an image file
    const extension = path.extname(fullPath).toLowerCase()
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg"]

    if (!imageExtensions.includes(extension)) {
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

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Image API Error:", error)
    return NextResponse.json({ error: "Failed to serve image" }, { status: 500 })
  }
}
