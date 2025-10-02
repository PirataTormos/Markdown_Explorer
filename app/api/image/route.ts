import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imagePath = searchParams.get("path")

    console.log("Image API called with path:", imagePath)

    if (!imagePath) {
      return NextResponse.json({ success: false, error: "Image path is required" }, { status: 400 })
    }

    // Security: Ensure the path is within the Markdowns directory
    const markdownsPath = path.join(process.cwd(), "Markdowns")

    // Remove "Markdowns/" prefix if it exists in the path
    let cleanPath = imagePath
    if (imagePath.startsWith("Markdowns/") || imagePath.startsWith("Markdowns\\")) {
      cleanPath = imagePath.substring(10)
    }

    const fullPath = path.join(markdownsPath, cleanPath)

    console.log("Full image path:", fullPath)

    // Check if the resolved path is still within the Markdowns directory
    if (!fullPath.startsWith(markdownsPath)) {
      console.error("Invalid image path - outside Markdowns directory")
      return NextResponse.json({ success: false, error: "Invalid image path" }, { status: 403 })
    }

    if (!fs.existsSync(fullPath)) {
      console.error("Image file does not exist:", fullPath)
      return NextResponse.json({ success: false, error: "Image not found" }, { status: 404 })
    }

    // Read the image file
    const imageBuffer = fs.readFileSync(fullPath)
    const ext = path.extname(fullPath).toLowerCase()

    // Determine content type
    let contentType = "image/jpeg"
    if (ext === ".png") contentType = "image/png"
    else if (ext === ".gif") contentType = "image/gif"
    else if (ext === ".svg") contentType = "image/svg+xml"
    else if (ext === ".webp") contentType = "image/webp"
    else if (ext === ".bmp") contentType = "image/bmp"

    console.log("Image loaded successfully:", cleanPath, "Type:", contentType)

    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Image API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: `Failed to load image: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}
