import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schema";

export default defineConfig({
  name: "aliento",
  title: "Aliento Health Blog",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "kygybgb7",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  basePath: "/admin",
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});
