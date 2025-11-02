"use client";

import { useState, useEffect } from "react";
import { MarkdownEditor } from "@/components/markdown-editor";
import type { Note } from "@/components/notes-app";

interface NoteEditorProps {
  note: Note;
  onUpdateNote: (id: string, title: string, content: string) => void;
}

export function NoteEditor({ note, onUpdateNote }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note.id, note.title, note.content]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    onUpdateNote(note.id, newTitle, content);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onUpdateNote(note.id, title, newContent);
  };

  return (
    <div className="flex h-full flex-col p-8">
      <input
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
        placeholder="Título"
        className="mb-4 border-0 outline-0 bg-transparent text-lg font-bold focus-visible:ring-0 px-0"
      />
      <MarkdownEditor
        value={content}
        onChange={handleContentChange}
        placeholder="Comece a escrever... Use # para títulos, **negrito**, *itálico*, - para listas"
      />
    </div>
  );
}
