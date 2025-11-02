"use client";

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Note } from "@/components/notes-app";
import { cn } from "@/lib/utils";

interface NotesListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
}

export function NotesList({
  notes,
  selectedNoteId,
  onSelectNote,
  onDeleteNote,
}: NotesListProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {notes.length === 0 ? (
        <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
          Nenhuma nota encontrada
        </div>
      ) : (
        <div className="divide-y divide-border">
          {notes.map((note) => (
            <div
              key={note.id}
              className={cn(
                "group relative cursor-pointer p-4 transition-colors hover:bg-accent",
                selectedNoteId === note.id && "bg-accent"
              )}
              onClick={() => onSelectNote(note.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 overflow-hidden">
                  <h3 className="truncate font-semibold text-foreground">
                    {note.title || "Sem título"}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatDistanceToNow(note.updatedAt, {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {note.content || "Sem conteúdo"}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNote(note.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
