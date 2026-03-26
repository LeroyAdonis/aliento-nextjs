import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || "kygybgb7",
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
  studioHost: process.env.SANITY_STUDIO_HOSTNAME,
  deployment: {
    appId: "o44cp3v9ngi4u0xvxwtvhsjc",
  },
});
