import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Markdown Explorer",
  description: "A modern Markdown file explorer and viewer",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <div className="flex-1 flex flex-col transition-all duration-200 ease-linear md:ml-[var(--sidebar-width)]">
                <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
                  <h1 className="text-xl font-semibold">Markdown Explorer</h1>
                  <div className="ml-auto">
                    <ModeToggle />
                  </div>
                </header>
                <main className="flex-1 overflow-auto">{children}</main>
              </div>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
