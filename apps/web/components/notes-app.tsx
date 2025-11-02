"use client"

import { useState, useEffect } from "react"
import { NotesList } from "@/components/notes-list"
import { NoteEditor } from "@/components/note-editor"
import { NotesHeader } from "@/components/notes-header"
import { FoldersSidebar, type FolderType } from "@/components/folders-sidebar"
import { FileText } from "lucide-react"

export interface Note {
  id: string
  title: string
  content: string
  updatedAt: Date
  folderId: string | null
}

export function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [folders, setFolders] = useState<FolderType[]>([])
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)

  // Load notes and folders from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes")
    const savedFolders = localStorage.getItem("folders")

    if (savedFolders) {
      setFolders(JSON.parse(savedFolders))
    }

    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes)
      const notesWithDates = parsedNotes.map((note: Note) => ({
        ...note,
        updatedAt: new Date(note.updatedAt),
      }))
      setNotes(notesWithDates)
      if (notesWithDates.length > 0) {
        setSelectedNoteId(notesWithDates[0].id)
      }
    } else {
      // Create a welcome note
      const welcomeNote: Note = {
        id: crypto.randomUUID(),
        title: "Bem-vindo ao Notes",
        content: "Comece a escrever suas notas aqui...",
        updatedAt: new Date(),
        folderId: null,
      }
      setNotes([welcomeNote])
      setSelectedNoteId(welcomeNote.id)
    }
  }, [])

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("notes", JSON.stringify(notes))
    }
  }, [notes])

  useEffect(() => {
    localStorage.setItem("folders", JSON.stringify(folders))
  }, [folders])

  useEffect(() => {
    setFolders((prevFolders) =>
      prevFolders.map((folder) => ({
        ...folder,
        noteCount: notes.filter((note) => note.folderId === folder.id).length,
      })),
    )
  }, [notes])

  const resetToDefaultState = () => {
    setSelectedNoteId(null)
    setSelectedFolderId(null)
    setSearchQuery("")
  }

  const createNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: "Nova Nota",
      content: "",
      updatedAt: new Date(),
      folderId: selectedFolderId,
    }
    setNotes([newNote, ...notes])
    setSelectedNoteId(newNote.id)
  }

  const updateNote = (id: string, title: string, content: string) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, title, content, updatedAt: new Date() } : note)))
  }

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id)
    setNotes(updatedNotes)
    if (selectedNoteId === id) {
      setSelectedNoteId(updatedNotes.length > 0 ? updatedNotes[0].id : null)
    }
  }

  const createFolder = () => {
    const newFolder: FolderType = {
      id: crypto.randomUUID(),
      name: "Nova Pasta",
      noteCount: 0,
    }
    setFolders([...folders, newFolder])
  }

  const renameFolder = (id: string, name: string) => {
    setFolders(folders.map((folder) => (folder.id === id ? { ...folder, name } : folder)))
  }

  const deleteFolder = (id: string) => {
    // Move notes from deleted folder to "All Notes"
    setNotes(notes.map((note) => (note.folderId === id ? { ...note, folderId: null } : note)))
    setFolders(folders.filter((folder) => folder.id !== id))
    if (selectedFolderId === id) {
      setSelectedFolderId(null)
    }
  }

  const selectedNote = notes.find((note) => note.id === selectedNoteId)

  const filteredNotes = notes.filter((note) => {
    const matchesFolder = selectedFolderId === null || note.folderId === selectedFolderId
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFolder && matchesSearch
  })

  const totalNotesCount = notes.length

  return (
    <div className="flex h-screen bg-background">
      <FoldersSidebar
        folders={folders}
        selectedFolderId={selectedFolderId}
        onSelectFolder={setSelectedFolderId}
        onCreateFolder={createFolder}
        onRenameFolder={renameFolder}
        onDeleteFolder={deleteFolder}
        totalNotesCount={totalNotesCount}
      />
      <div className="flex w-80 flex-col border-r border-border">
        <NotesHeader
          onCreateNote={createNote}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onLogoClick={resetToDefaultState}
        />
        <NotesList
          notes={filteredNotes}
          selectedNoteId={selectedNoteId}
          onSelectNote={setSelectedNoteId}
          onDeleteNote={deleteNote}
        />
      </div>
      <div className="flex-1">
        {selectedNote ? (
          <NoteEditor note={selectedNote} onUpdateNote={updateNote} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-full bg-muted/50 p-6">
                <FileText className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-foreground">Nenhuma nota selecionada</h2>
                <p className="text-sm text-muted-foreground">
                  Selecione uma nota da lista ou crie uma nova para começar.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
