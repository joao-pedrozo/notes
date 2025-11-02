import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import connectDB from "./db";
import categoryRoutes from "./routes/categoryRoutes";
import noteRoutes from "./routes/noteRoutes";

await connectDB();

const app = new Elysia()
  .use(categoryRoutes)
  .use(noteRoutes)
  .use(cors())
  .listen(3000);

console.log("✨ Server running at http://localhost:3000");

export type App = typeof app;
