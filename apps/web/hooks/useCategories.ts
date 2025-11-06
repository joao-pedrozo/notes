"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "../../api/src/client";

export interface Category {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  name: string;
}

export interface UpdateCategoryInput {
  name?: string;
}

function normalizeCategory(category: any): Category {
  return {
    _id: category._id?.toString() || category.id || "",
    name: category.name || "",
    createdAt: category.createdAt
      ? new Date(category.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: category.updatedAt
      ? new Date(category.updatedAt).toISOString()
      : new Date().toISOString(),
  };
}

export function useCategories() {
  const queryClient = useQueryClient();

  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.categories.get();
      const data = response.data as any;

      if (data?.error) {
        throw new Error(data.error || "Erro ao buscar categorias");
      }

      if (Array.isArray(data)) {
        console.log(555, data);

        return data.map(normalizeCategory);
      }

      return [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (input: CreateCategoryInput) => {
      const response = await api.categories.post(input);
      const data = response.data as any;

      if (data?.error) {
        throw new Error(data.error || "Erro ao criar categoria");
      }

      return normalizeCategory(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar categoria");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateCategoryInput;
    }) => {
      if (!input.name) {
        throw new Error("Nome da categoria é obrigatório");
      }

      const response = await api.categories({ id }).put({ name: input.name });
      const data = response.data as any;

      if (data?.error) {
        throw new Error(data.error || "Erro ao atualizar categoria");
      }

      return normalizeCategory(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Categoria atualizada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar categoria");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.categories({ id }).delete();
      const data = response.data as any;

      if (data?.error) {
        throw new Error(data.error || "Erro ao deletar categoria");
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao deletar categoria");
    },
  });

  return {
    categories: categories || [],
    isLoading,
    error,
    createCategory: createMutation.mutateAsync,
    updateCategory: updateMutation.mutateAsync,
    deleteCategory: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
