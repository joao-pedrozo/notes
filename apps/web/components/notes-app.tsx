"use client";

import { useState, useEffect, useMemo } from "react";
import { NotesList } from "@/components/notes-list";
import { NoteEditor } from "@/components/note-editor";
import { NotesHeader } from "@/components/notes-header";
import { FoldersSidebar, type FolderType } from "@/components/folders-sidebar";
import { FileText } from "lucide-react";
import { useNotes, type Note as ApiNote } from "@/hooks/useNotes";
import { useCategories } from "@/hooks/useCategories";

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
  folderId: string | null;
}

export function NotesApp() {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const {
    notes: apiNotes,
    isLoading,
    createNote: createNoteApi,
    updateNote: updateNoteApi,
    deleteNote: deleteNoteApi,
    isCreating,
    isUpdating,
    isDeleting,
  } = useNotes();

  const {
    categories: allCategories,
    isLoading: isCategoriesLoading,
    createCategory: createCategoryApi,
    updateCategory: updateCategoryApi,
    deleteCategory: deleteCategoryApi,
    isCreating: isCreatingCategory,
    isUpdating: isUpdatingCategory,
    isDeleting: isDeletingCategory,
  } = useCategories();

  // Converter notas da API para o formato do componente
  const notes = useMemo(() => {
    return apiNotes.map((apiNote) => ({
      id: apiNote._id,
      title: apiNote.title,
      content: apiNote.content,
      updatedAt: new Date(apiNote.updatedAt),
      folderId: apiNote.category || null, // Usando category como folderId temporariamente
    }));
  }, [apiNotes]);

  // Selecionar primeira nota quando carregar
  useEffect(() => {
    if (!isLoading && notes.length > 0 && !selectedNoteId) {
      setSelectedNoteId(notes[0].id);
    }
  }, [isLoading, notes, selectedNoteId]);

  const resetToDefaultState = () => {
    setSelectedNoteId(null);
    setSelectedFolderId(null);
    setSearchQuery("");
  };

  const createNote = async () => {
    try {
      // Se uma categoria estiver selecionada, usar ela; senão, usar a primeira disponível ou criar uma
      let categoryId = selectedFolderId;

      if (!categoryId && allCategories.length > 0) {
        // Se não há categoria selecionada, usar a primeira disponível
        categoryId = allCategories[0]._id;
      } else if (!categoryId && allCategories.length === 0) {
        // Se não há categorias, criar uma padrão
        const defaultCategory = await createCategoryApi({ name: "Geral" });
        categoryId = defaultCategory._id;
        setSelectedFolderId(categoryId);
      }

      if (!categoryId) {
        throw new Error("Não foi possível criar a nota. Tente novamente.");
      }

      const newNote = await createNoteApi({
        title: "Nova Nota",
        content: "",
        category: categoryId,
      });

      if (newNote) {
        setSelectedNoteId(newNote._id);
      }
    } catch (error) {
      console.error("Erro ao criar nota:", error);
    }
  };

  const updateNote = async (id: string, title: string, content: string) => {
    try {
      const note = notes.find((n) => n.id === id);
      if (!note) return;

      await updateNoteApi({
        id,
        input: {
          title,
          content,
          category: note.folderId || undefined,
        },
      });
    } catch (error) {
      console.error("Erro ao atualizar nota:", error);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await deleteNoteApi(id);
      const updatedNotes = notes.filter((note) => note.id !== id);
      if (selectedNoteId === id) {
        setSelectedNoteId(updatedNotes.length > 0 ? updatedNotes[0].id : null);
      }
    } catch (error) {
      console.error("Erro ao deletar nota:", error);
    }
  };

  // Converter categories para folders e filtrar apenas as que têm notas
  const folders = useMemo(() => {
    // Buscar IDs de categories que têm notas relacionadas

    // Filtrar categories que estão em uso

    // Calcular noteCount para cada category
    return allCategories.map((category) => ({
      id: category._id,
      name: category.name,
      noteCount: notes.filter((note) => note.folderId === category._id).length,
    }));
  }, [allCategories, notes]);

  const createFolder = async () => {
    try {
      const newCategory = await createCategoryApi({
        name: "Nova Pasta",
      });

      if (newCategory) {
        // Selecionar a nova categoria automaticamente
        setSelectedFolderId(newCategory._id);
      }
    } catch (error) {
      console.error("Erro ao criar pasta:", error);
    }
  };

  const renameFolder = async (id: string, name: string) => {
    try {
      await updateCategoryApi({
        id,
        input: { name },
      });
    } catch (error) {
      console.error("Erro ao renomear pasta:", error);
    }
  };

  const deleteFolder = async (id: string) => {
    try {
      // Primeiro, mover todas as notas dessa categoria para "sem categoria"
      // Nota: Isso requer atualizar cada nota individualmente
      // Por enquanto, vamos apenas deletar a categoria
      // As notas ficarão sem categoria (null)
      await deleteCategoryApi(id);

      if (selectedFolderId === id) {
        setSelectedFolderId(null);
      }
    } catch (error) {
      console.error("Erro ao deletar pasta:", error);
    }
  };

  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  const filteredNotes = notes.filter((note) => {
    const matchesFolder =
      selectedFolderId === null || note.folderId === selectedFolderId;
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const totalNotesCount = notes.length;

  const isLoadingData = isLoading || isCategoriesLoading;

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
        isLoading={isLoadingData}
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
                <h2 className="text-2xl font-semibold text-foreground">
                  Nenhuma nota selecionada
                </h2>
                <p className="text-sm text-muted-foreground">
                  Selecione uma nota da lista ou crie uma nova para começar.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
