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
  const results: FileNode[] = []

  try {
    console.log(`Reading directory: ${dirPath}`)

    if (!fs.existsSync(dirPath)) {
      console.log(`Directory does not exist: ${dirPath}`)
      return []
    }

    if (!isValidDirectory(dirPath)) {
      console.log(`Path is not a directory: ${dirPath}`)
      return []
    }

    const items = fs.readdirSync(dirPath)
    console.log(`Found ${items.length} items in ${dirPath}`)

    for (const itemName of items) {
      try {
        // Skip hidden files and system files
        if (itemName.startsWith(".")) {
          console.log(`Skipping hidden file: ${itemName}`)
          continue
        }

        const fullPath = path.join(dirPath, itemName)
        const relativePath = basePath ? path.join(basePath, itemName).replace(/\\/g, "/") : itemName

        console.log(`Processing: ${itemName}`)

        const stats = fs.statSync(fullPath)

        if (stats.isDirectory()) {
          if (isValidDirectory(fullPath)) {
            const children = getFileStructure(fullPath, relativePath)
            if (children.length > 0) {
              results.push({
                name: itemName,
                path: relativePath,
                type: "directory",
                children,
              })
              console.log(`Added directory: ${itemName} with ${children.length} children`)
            } else {
              console.log(`Skipped empty directory: ${itemName}`)
            }
          }
        } else if (stats.isFile()) {
          if (isValidMarkdownFile(fullPath)) {
            const extension = path.extname(itemName).toLowerCase()
            results.push({
              name: itemName,
              path: relativePath,
              type: "file",
              extension,
            })
            console.log(`Added file: ${itemName}`)
          } else {
            console.log(`Skipped invalid or unsupported file: ${itemName}`)
          }
        }
      } catch (itemError) {
        console.error(`Error processing item ${itemName}:`, itemError)
        continue
      }
    }

    // Sort results: directories first, then files, both alphabetically
    const sorted = results.sort((a, b) => {
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

function createSampleFiles(markdownsPath: string) {
  try {
    console.log("Creating sample files...")

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

    const readmePath = path.join(markdownsPath, "README.md")
    if (!fs.existsSync(readmePath)) {
      fs.writeFileSync(readmePath, sampleContent, "utf8")
      console.log("Sample README.md created successfully")
    }

    // Create sample folder structure
    const sampleDir = path.join(markdownsPath, "Examples")
    if (!fs.existsSync(sampleDir)) {
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

      const examplePath = path.join(sampleDir, "example.md")
      if (!fs.existsSync(examplePath)) {
        fs.writeFileSync(examplePath, exampleContent, "utf8")
        console.log("Example files created successfully")
      }
    }
  } catch (fileError) {
    console.error("Error creating sample files:", fileError)
    // Don't throw, just log the error
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

        // Create sample files
        createSampleFiles(markdownsPath)
      } catch (mkdirError) {
        console.error("Error creating Markdowns directory:", mkdirError)
        return NextResponse.json(
          {
            success: false,
            error: `Failed to create Markdowns directory: ${mkdirError instanceof Error ? mkdirError.message : "Unknown error"}`,
          },
          { status: 500 },
        )
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
