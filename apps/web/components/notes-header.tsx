"use client"

import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface NotesHeaderProps {
  onCreateNote: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onLogoClick: () => void
}

export function NotesHeader({ onCreateNote, searchQuery, onSearchChange, onLogoClick }: NotesHeaderProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold cursor-pointer hover:opacity-80 transition-opacity" onClick={onLogoClick}>
          Notes
        </h1>
        <Button size="icon" variant="ghost" onClick={onCreateNote} className="h-8 w-8 cursor-pointer">
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-muted/50 border-0"
        />
      </div>
    </div>
  )
}
