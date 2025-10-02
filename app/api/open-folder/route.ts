import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"
import fs from "fs"

const execAsync = promisify(exec)

export async function POST(request: Request) {
  try {
    // Leer la configuración
    const configPath = path.join(process.cwd(), "config.json")

    if (!fs.existsSync(configPath)) {
      return NextResponse.json(
        {
          success: false,
          error: "Archivo de configuración no encontrado",
        },
        { status: 404 },
      )
    }

    const configFile = fs.readFileSync(configPath, "utf-8")
    const config = JSON.parse(configFile)

    // Obtener la ruta configurada
    const folderPath = config.folderPath || "./Markdowns"
    const absolutePath = path.resolve(process.cwd(), folderPath)

    // Verificar que la carpeta existe
    if (!fs.existsSync(absolutePath)) {
      return NextResponse.json(
        {
          success: false,
          error: `La carpeta no existe: ${absolutePath}`,
        },
        { status: 404 },
      )
    }

    // Determinar el comando según el sistema operativo
    let command: string
    const platform = process.platform

    if (platform === "win32") {
      // Windows
      command = `explorer "${absolutePath}"`
    } else if (platform === "darwin") {
      // macOS
      command = `open "${absolutePath}"`
    } else {
      // Linux
      command = `xdg-open "${absolutePath}"`
    }

    // Ejecutar el comando
    await execAsync(command)

    return NextResponse.json({
      success: true,
      message: "Explorador de archivos abierto",
      path: absolutePath,
      platform: platform,
    })
  } catch (error) {
    console.error("Error abriendo el explorador de archivos:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}

// También permitimos GET para obtener la ruta configurada
export async function GET() {
  try {
    const configPath = path.join(process.cwd(), "config.json")

    if (!fs.existsSync(configPath)) {
      return NextResponse.json(
        {
          success: false,
          error: "Archivo de configuración no encontrado",
        },
        { status: 404 },
      )
    }

    const configFile = fs.readFileSync(configPath, "utf-8")
    const config = JSON.parse(configFile)
    const folderPath = config.folderPath || "./Markdowns"
    const absolutePath = path.resolve(process.cwd(), folderPath)

    return NextResponse.json({
      success: true,
      folderPath: folderPath,
      absolutePath: absolutePath,
      exists: fs.existsSync(absolutePath),
    })
  } catch (error) {
    console.error("Error leyendo configuración:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
