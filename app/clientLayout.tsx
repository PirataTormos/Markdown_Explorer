"use client"
import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { useMarkdownStore } from "@/lib/store"

const inter = Inter({ subsets: ["latin"] })

function HeaderContent() {
  const { setCurrentFile, currentFile } = useMarkdownStore()

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Button
        variant="ghost"
        onClick={() => setCurrentFile(null)}
        className={`text-lg font-semibold hover:bg-accent/50 px-3 transition-colors ${
          currentFile === null ? "bg-accent/30" : ""
        }`}
      >
        🏠 FRIK-E3D
      </Button>
      <div className="ml-auto">
        <ModeToggle />
      </div>
    </header>
  )
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <HeaderContent />
              <main className="flex-1 overflow-auto">{children}</main>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
