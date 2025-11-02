"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "../../api/src/client";

export interface Note {
  _id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  category: string;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  category?: string;
}

function normalizeNote(note: any): Note {
  return {
    _id: note._id?.toString() || note.id || "",
    title: note.title || "",
    content: note.content || "",
    category: note.category?.toString() || note.category || "",
    createdAt: note.createdAt
      ? new Date(note.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: note.updatedAt
      ? new Date(note.updatedAt).toISOString()
      : new Date().toISOString(),
  };
}

export function useNotes() {
  const queryClient = useQueryClient();

  // Listar todas as notas
  const {
    data: notes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const response = await api.notes.get();
      const data = response.data as any;

      if (data?.error) {
        throw new Error(data.error || "Erro ao buscar notas");
      }

      if (Array.isArray(data)) {
        return data.map(normalizeNote);
      }

      return [];
    },
  });

  // Buscar nota por ID
  const useNote = (id: string | null) => {
    return useQuery({
      queryKey: ["notes", id],
      queryFn: async () => {
        if (!id) return null;
        const response = await api.notes({ id }).get();
        const data = response.data as any;

        if (data?.error) {
          throw new Error(data.error || "Erro ao buscar nota");
        }

        if (data) {
          return normalizeNote(data);
        }

        return null;
      },
      enabled: !!id,
    });
  };

  // Criar nota
  const createMutation = useMutation({
    mutationFn: async (input: CreateNoteInput) => {
      const response = await api.notes.post(input);
      const data = response.data as any;

      if (data?.error) {
        throw new Error(data.error || "Erro ao criar nota");
      }

      return normalizeNote(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar nota");
    },
  });

  // Atualizar nota
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateNoteInput;
    }) => {
      // Garantir que todos os campos estão presentes para a API
      const fullInput = {
        title: input.title ?? "",
        content: input.content ?? "",
        category: input.category ?? "",
      };

      const response = await api.notes({ id }).put(fullInput);
      const data = response.data as any;

      if (data?.error) {
        throw new Error(data.error || "Erro ao atualizar nota");
      }

      return normalizeNote(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Nota atualizada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar nota");
    },
  });

  // Deletar nota
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.notes({ id }).delete();
      const data = response.data as any;

      if (data?.error) {
        throw new Error(data.error || "Erro ao deletar nota");
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Nota deletada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao deletar nota");
    },
  });

  return {
    notes: notes || [],
    isLoading,
    error,
    useNote,
    createNote: createMutation.mutateAsync,
    updateNote: updateMutation.mutateAsync,
    deleteNote: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
