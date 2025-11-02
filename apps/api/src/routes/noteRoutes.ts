import { t, Elysia } from "elysia";
import {
  listNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from "../services/noteService";

export const noteRoutes = new Elysia({ prefix: "/notes" })
  .get("/", async () => await listNotes())
  .post(
    "/",
    async ({ body, set }) => {
      try {
        return await createNote(body);
      } catch (err: any) {
        set.status = 400;
        return { error: err.message };
      }
    },
    {
      body: t.Object({
        title: t.String(),
        content: t.String(),
        category: t.String(),
      }),
    }
  )
  .get("/:id", async ({ params }) => await getNoteById(params.id))
  .put(
    "/:id",
    async ({ params, body, set }) => {
      try {
        return await updateNote(params.id, body);
      } catch (err: any) {
        set.status = 400;
        return { error: err.message };
      }
    },
    {
      body: t.Object({
        title: t.String(),
        content: t.String(),
        category: t.String(),
      }),
    }
  )
  .delete("/:id", async ({ params }) => await deleteNote(params.id));

export default noteRoutes;
