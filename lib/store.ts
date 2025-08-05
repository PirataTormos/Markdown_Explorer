"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface MarkdownStore {
  currentFile: string | null
  setCurrentFile: (file: string | null) => void
}

export const useMarkdownStore = create<MarkdownStore>()(
  persist(
    (set) => ({
      currentFile: null,
      setCurrentFile: (file) => set({ currentFile: file }),
    }),
    {
      name: "markdown-explorer-storage",
    },
  ),
)
