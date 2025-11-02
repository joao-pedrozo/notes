import type { App } from "./";
import { treaty } from "@elysiajs/eden";

const url =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.URL_DOMAIN ??
  "http://localhost:3000";
export const api = treaty<App>(url);
export type { App };
