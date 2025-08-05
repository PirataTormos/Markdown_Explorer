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

function getFileStructure(dirPath: string, basePath = ""): FileNode[] {
  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true })
    const result: FileNode[] = []

    for (const item of items) {
      const fullPath = path.join(dirPath, item.name)
      const relativePath = path.join(basePath, item.name)

      if (item.isDirectory()) {
        const children = getFileStructure(fullPath, relativePath)
        result.push({
          name: item.name,
          path: relativePath,
          type: "directory",
          children,
        })
      } else if (item.isFile()) {
        const extension = path.extname(item.name).toLowerCase()
        if ([".md", ".txt", ".mdx"].includes(extension)) {
          result.push({
            name: item.name,
            path: relativePath,
            type: "file",
            extension,
          })
        }
      }
    }

    return result.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "directory" ? -1 : 1
      }
      return a.name.localeCompare(b.name)
    })
  } catch (error) {
    console.error("Error reading directory:", error)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    const markdownsPath = path.join(process.cwd(), "Markdowns")

    // Create Markdowns directory if it doesn't exist
    if (!fs.existsSync(markdownsPath)) {
      fs.mkdirSync(markdownsPath, { recursive: true })

      // Create sample files
      const sampleContent = `# Welcome to Markdown Explorer

This is a sample Markdown file to demonstrate the functionality.

## Features

- 📁 **File Explorer**: Navigate through your Markdown files easily
- 🎨 **Modern UI**: Clean and intuitive interface
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 🔍 **Search**: Find files quickly
- 📝 **Markdown Rendering**: Beautiful rendering of Markdown content

## Getting Started

1. Place your Markdown files in the \`Markdowns\` directory
2. Organize them in folders as needed
3. Use the sidebar to navigate and explore your documents

Enjoy exploring your Markdown documents!
`

      fs.writeFileSync(path.join(markdownsPath, "README.md"), sampleContent)

      // Create sample folder structure
      const sampleDir = path.join(markdownsPath, "Examples")
      fs.mkdirSync(sampleDir, { recursive: true })

      fs.writeFileSync(
        path.join(sampleDir, "example.md"),
        `# Example Document

This is an example document in a subfolder.

## Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

## List Example

- Item 1
- Item 2
- Item 3
`,
      )
    }

    const fileStructure = getFileStructure(markdownsPath)

    return NextResponse.json({
      success: true,
      data: fileStructure,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to read file structure" }, { status: 500 })
  }
}
