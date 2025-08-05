import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

interface FileNode {
  name: string
  path: string
  type: "file" | "directory"
  children?: FileNode[]
  extension?: string
}

function isValidMarkdownFile(filePath: string): boolean {
  try {
    const stats = fs.statSync(filePath)
    if (!stats.isFile()) return false

    const extension = path.extname(filePath).toLowerCase()
    return [".md", ".txt", ".mdx"].includes(extension)
  } catch {
    return false
  }
}

function isValidDirectory(dirPath: string): boolean {
  try {
    const stats = fs.statSync(dirPath)
    return stats.isDirectory()
  } catch {
    return false
  }
}

function getFileStructure(dirPath: string, basePath = ""): FileNode[] {
  try {
    console.log(`Reading directory: ${dirPath}`)

    if (!fs.existsSync(dirPath)) {
      console.log(`Directory does not exist: ${dirPath}`)
      return []
    }

    // Check if it's actually a directory
    if (!isValidDirectory(dirPath)) {
      console.log(`Path is not a directory: ${dirPath}`)
      return []
    }

    let items
    try {
      items = fs.readdirSync(dirPath, { withFileTypes: true })
    } catch (readError) {
      console.error(`Error reading directory ${dirPath}:`, readError)
      return []
    }

    console.log(`Found ${items.length} items in ${dirPath}`)

    const result: FileNode[] = []

    for (const item of items) {
      try {
        // Skip hidden files and system files
        if (item.name.startsWith(".")) {
          console.log(`Skipping hidden file: ${item.name}`)
          continue
        }

        const fullPath = path.join(dirPath, item.name)
        const relativePath = path.join(basePath, item.name).replace(/\\/g, "/")

        console.log(`Processing: ${item.name} (${item.isDirectory() ? "directory" : "file"})`)

        if (item.isDirectory()) {
          // Double-check it's actually a directory
          if (isValidDirectory(fullPath)) {
            const children = getFileStructure(fullPath, relativePath)
            // Only include the folder if it has markdown files (directly or indirectly)
            if (children.length > 0) {
              result.push({
                name: item.name,
                path: relativePath,
                type: "directory",
                children,
              })
              console.log(`Added directory: ${item.name} with ${children.length} children`)
            } else {
              console.log(`Skipped empty directory: ${item.name}`)
            }
          } else {
            console.log(`Skipped invalid directory: ${item.name}`)
          }
        } else if (item.isFile()) {
          // Double-check it's actually a file and has valid extension
          if (isValidMarkdownFile(fullPath)) {
            const extension = path.extname(item.name).toLowerCase()
            result.push({
              name: item.name,
              path: relativePath,
              type: "file",
              extension,
            })
            console.log(`Added file: ${item.name}`)
          } else {
            console.log(`Skipped invalid or unsupported file: ${item.name}`)
          }
        }
      } catch (itemError) {
        console.error(`Error processing item ${item.name}:`, itemError)
        // Continue with other items
      }
    }

    const sorted = result.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "directory" ? -1 : 1
      }
      return a.name.localeCompare(b.name)
    })

    console.log(`Returning ${sorted.length} items from ${dirPath}`)
    return sorted
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("Files API called")
    const markdownsPath = path.resolve(process.cwd(), "Markdowns")
    console.log(`Markdowns path: ${markdownsPath}`)

    // Create Markdowns directory if it doesn't exist
    if (!fs.existsSync(markdownsPath)) {
      console.log("Creating Markdowns directory...")
      try {
        fs.mkdirSync(markdownsPath, { recursive: true })
        console.log("Markdowns directory created successfully")
      } catch (mkdirError) {
        console.error("Error creating Markdowns directory:", mkdirError)
        throw new Error(`Failed to create Markdowns directory: ${mkdirError}`)
      }

      // Create sample files
      const sampleContent = `# Welcome to Markdown Explorer

This is a sample Markdown file to demonstrate the functionality.

## Features

- 📁 **File Explorer**: Navigate through your Markdown files easily
- 🎨 **Modern UI**: Clean and intuitive interface
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 🔍 **Search**: Find files quickly
- 📝 **Markdown Rendering**: Beautiful rendering of Markdown content

## Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

## Getting Started

1. Place your Markdown files in the \`Markdowns\` directory
2. Organize them in folders as needed
3. Use the sidebar to navigate and explore your documents

Enjoy exploring your Markdown documents!
`

      try {
        console.log("Creating sample README.md...")
        const readmePath = path.join(markdownsPath, "README.md")
        fs.writeFileSync(readmePath, sampleContent, "utf8")
        console.log("Sample README.md created successfully")

        // Create sample folder structure
        const sampleDir = path.join(markdownsPath, "Examples")
        console.log("Creating Examples directory...")
        fs.mkdirSync(sampleDir, { recursive: true })

        const exampleContent = `# Example Document

This is an example document in a subfolder.

## Code Example

\`\`\`python
def greet(name):
    print(f"Hello, {name}!")

greet("World")
\`\`\`

## List Example

- Item 1
- Item 2
- Item 3

## Table Example

| Name | Age | City |
|------|-----|------|
| John | 25  | NYC  |
| Jane | 30  | LA   |

## Sample Image

If you add images to your Markdowns folder, they will display here:

![Sample Image](./sample-image.png)
`

        console.log("Creating example.md...")
        const examplePath = path.join(sampleDir, "example.md")
        fs.writeFileSync(examplePath, exampleContent, "utf8")
        console.log("Example files created successfully")
      } catch (fileError) {
        console.error("Error creating sample files:", fileError)
        // Continue anyway, maybe user will add their own files
      }
    }

    console.log("Getting file structure...")
    const fileStructure = getFileStructure(markdownsPath)
    console.log(`File structure complete. Found ${fileStructure.length} top-level items`)

    return NextResponse.json({
      success: true,
      data: fileStructure,
    })
  } catch (error) {
    console.error("Files API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: `Failed to read file structure: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}
