"use client";

import type React from "react";

import { useState } from "react";
import {
  Folder,
  FolderPlus,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface FolderType {
  id: string;
  name: string;
  noteCount: number;
}

interface FoldersSidebarProps {
  folders: FolderType[];
  selectedFolderId: string | null;
  onSelectFolder: (id: string | null) => void;
  onCreateFolder: () => void;
  onRenameFolder: (id: string, name: string) => void;
  onDeleteFolder: (id: string) => void;
  totalNotesCount: number;
  isLoading?: boolean;
}

export function FoldersSidebar({
  folders,
  selectedFolderId,
  onSelectFolder,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  totalNotesCount,
  isLoading = false,
}: FoldersSidebarProps) {
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const startEditing = (folder: FolderType) => {
    setEditingFolderId(folder.id);
    setEditingName(folder.name);
  };

  const finishEditing = () => {
    if (editingFolderId && editingName.trim()) {
      onRenameFolder(editingFolderId, editingName.trim());
    }
    setEditingFolderId(null);
    setEditingName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      finishEditing();
    } else if (e.key === "Escape") {
      setEditingFolderId(null);
      setEditingName("");
    }
  };

  console.log("Rendering FoldersSidebar with folders:", folders);

  return (
    <div className="flex w-56 flex-col border-r border-border bg-muted/30">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="text-sm font-semibold text-muted-foreground">PASTAS</h2>
        <Button
          size="icon"
          variant="ghost"
          onClick={onCreateFolder}
          className="h-7 w-7 cursor-pointer"
        >
          <FolderPlus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {/* All Notes */}
        <button
          onClick={() => onSelectFolder(null)}
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent cursor-pointer",
            selectedFolderId === null && "bg-accent"
          )}
        >
          <Folder className="h-4 w-4 text-blue-500" />
          <span className="flex-1 text-left">Todas as Notas</span>
          <span className="text-xs text-muted-foreground">
            {totalNotesCount}
          </span>
        </button>

        {/* Folders */}
        <div className="mt-2 space-y-1">
          {isLoading ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Carregando pastas...
            </div>
          ) : folders.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Nenhuma pasta encontrada
            </div>
          ) : (
            folders.map((folder) => (
              <div
                key={folder.id}
                className={cn(
                  "group flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-accent",
                  selectedFolderId === folder.id && "bg-accent"
                )}
              >
                {editingFolderId === folder.id ? (
                  <>
                    <Folder className="h-4 w-4 shrink-0 text-yellow-500" />
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={finishEditing}
                      onKeyDown={handleKeyDown}
                      className="h-6 flex-1 bg-background px-2 text-sm"
                      autoFocus
                    />
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => onSelectFolder(folder.id)}
                      className="flex flex-1 items-center gap-2 text-sm cursor-pointer"
                    >
                      <Folder className="h-4 w-4 text-yellow-500" />
                      <span className="flex-1 truncate text-left">
                        {folder.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {folder.noteCount}
                      </span>
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => startEditing(folder)}
                          className="cursor-pointer"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Renomear
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDeleteFolder(folder.id)}
                          className="text-destructive cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
