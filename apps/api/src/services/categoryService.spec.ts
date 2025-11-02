import { test, expect, beforeEach, afterEach, describe } from "bun:test";
import {
  listCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "./categoryService";
import Category from "../models/categoryModel";
import { connectTestDB, disconnectDB } from "../db";

describe("Category Service", () => {
  beforeEach(async () => {
    await connectTestDB();
    await Category.deleteMany({});
  });

  afterEach(async () => {
    await disconnectDB();
  });

  test("should create category successfully", async () => {
    const data = { name: "Cookie" };
    const created = await createCategory(data as any);

    expect(created).toBeDefined();
    expect(created.name).toBe("Cookie");
    expect(created.createdAt).toBeDefined();
    expect(created.updatedAt).toBeDefined();

    const saved = await Category.findById(created._id);
    expect(saved).toBeDefined();
    expect(saved?.name).toBe("Cookie");
  });

  test("should list categories", async () => {
    await createCategory({ name: "Cookie" } as any);
    await createCategory({ name: "Pie" } as any);

    const all = await listCategories();
    expect(all.length).toBeGreaterThanOrEqual(2);
    expect(all[0].name).toBeDefined();
  });

  test("should get category by id", async () => {
    const created = await createCategory({ name: "Cookie" } as any);
    const found = await getCategoryById(created._id.toString());

    expect(found).toBeDefined();
    expect(found?.name).toBe("Cookie");
  });

  test("should update category", async () => {
    const created = await createCategory({ name: "Cookie" } as any);
    const updated = await updateCategory(created._id.toString(), {
      name: "Pie",
    });

    expect(updated).toBeDefined();
    expect(updated?.name).toBe("Pie");
    expect(updated?.updatedAt).not.toEqual(created.updatedAt);
  });

  test("should delete category", async () => {
    const created = await createCategory({ name: "Pie" } as any);
    const deleted = await deleteCategory(created._id.toString());

    expect(deleted).toBeDefined();
    const found = await Category.findById(created._id);
    expect(found).toBeNull();
  });
});
