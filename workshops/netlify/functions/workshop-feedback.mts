import type { Config } from "@netlify/functions";
import { handleWorkshopFeedback } from "./_shared/workshopFeedback.mjs";

export default async (request: Request) => handleWorkshopFeedback(request, {
  SUPABASE_URL: Netlify.env.get("SUPABASE_URL"),
  SUPABASE_ANON_KEY: Netlify.env.get("SUPABASE_ANON_KEY"),
});

export const config: Config = {
  path: "/api/workshop-feedback",
};
