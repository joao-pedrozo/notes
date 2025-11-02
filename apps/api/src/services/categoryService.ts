import Category from "../models/categoryModel";

type CreateCategoryInput = {
  name: string;
};

const listCategories = async () => {
  return await Category.find().sort({ createdAt: -1 });
};

const getCategoryById = async (id: string) => {
  return await Category.findById(id);
};

const createCategory = async (input: CreateCategoryInput) => {
  const category = new Category({ name: input.name });
  return await category.save();
};

const updateCategory = async (
  id: string,
  input: Partial<CreateCategoryInput>
) => {
  return await Category.findByIdAndUpdate(
    id,
    { ...input, updatedAt: new Date() },
    { new: true }
  );
};

const deleteCategory = async (id: string) => {
  return await Category.findByIdAndDelete(id);
};

export {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
