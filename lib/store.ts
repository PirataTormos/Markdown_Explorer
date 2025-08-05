"use client"

import { create } from "zustand"

interface MarkdownStore {
  currentFile: string | null
  setCurrentFile: (file: string | null) => void
}

export const useMarkdownStore = create<MarkdownStore>()((set) => ({
  currentFile: null,
  setCurrentFile: (file) => set({ currentFile: file }),
}))
