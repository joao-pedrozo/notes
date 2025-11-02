import mongoose from "mongoose";
import Note from "../models/noteModel";
import Category from "../models/categoryModel";

type CreateNoteInput = {
  title: string;
  content: string;
  category: string;
};

const listNotes = async () => {
  return await Note.find().sort({ createdAt: -1 });
};

const getNoteById = async (id: string) => {
  return await Note.findById(id);
};

const validateCategoryId = (categoryId: string): void => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new Error(
      `Invalid category ID: "${categoryId}". Category must be a valid MongoDB ObjectId.`
    );
  }
};

const createNote = async (input: CreateNoteInput) => {
  validateCategoryId(input.category);

  const category = await Category.findById(input.category);

  if (!category) {
    throw new Error(`Category with ID "${input.category}" does not exist.`);
  }

  try {
    const note = new Note({
      title: input.title,
      content: input.content,
      category: input.category,
    });
    return await note.save();
  } catch (error) {
    if (error instanceof Error && error.name === "ValidationError") {
      throw new Error(`Note validation failed: ${error.message}`);
    }
    throw error;
  }
};

const updateNote = async (id: string, input: Partial<CreateNoteInput>) => {
  if (input.category) {
    validateCategoryId(input.category);

    const category = await Category.findById(input.category);
    if (!category) {
      throw new Error(`Category with ID "${input.category}" does not exist.`);
    }
  }

  try {
    return await Note.findByIdAndUpdate(
      id,
      { ...input, updatedAt: new Date() },
      { new: true }
    );
  } catch (error: any) {
    if (error.name === "CastError" || error.name === "ValidationError") {
      throw new Error(`Note update failed: ${error.message}`);
    }
    throw error;
  }
};

const deleteNote = async (id: string) => {
  return await Note.findByIdAndDelete(id);
};

export { listNotes, getNoteById, createNote, updateNote, deleteNote };
