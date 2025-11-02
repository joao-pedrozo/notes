import { t, Elysia } from "elysia";
import {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";

export const categoryRoutes = new Elysia({ prefix: "/categories" })
  .get("/", async () => await listCategories())
  .post("/", async ({ body }) => await createCategory(body), {
    body: t.Object({
      name: t.String(),
    }),
  })
  .get("/:id", async ({ params }) => await getCategoryById(params.id))
  .put(
    "/:id",
    async ({ params, body }) => await updateCategory(params.id, body),
    {
      body: t.Object({ name: t.String() }),
    }
  )
  .delete("/:id", async ({ params }) => await deleteCategory(params.id));

export default categoryRoutes;
