Studio hosting: deploy options and fallback

Problem: Sanity hosted studio (https://kygybgb7.sanity.studio/) returned 404 because the project had no hosted studio hostname and the CLI couldn't create it with available credentials.

What was done:
- Added a GitHub Actions workflow `.github/workflows/deploy-studio-to-gh-pages.yml` that builds `studio-aliento` and publishes `studio-aliento/dist` to the `gh-pages` branch. This provides an immediate hosted fallback at `https://<org>.github.io/<repo>/` once Actions runs.

Why:
- The Sanity hosted deploy requires a user-level operation via Sanity Manage UI or a user token with sufficient rights. That wasn't possible non-interactively here. Publishing the built static studio to gh-pages ensures the studio is publicly available with no extra tokens.

How to verify:
1. Push to `dev-aliento` or `main` (workflow is triggered on changes to `studio-aliento/**`).
2. GitHub Actions will build and push dist/ to gh-pages.
3. Visit: `https://<owner>.github.io/aliento-nextjs/` (replace <owner> with the GitHub org/user owning the repo).

Next steps to enable `*.sanity.studio` hosted URL:
1. In Sanity Manage (https://www.sanity.io/manage) log in with a user who has project-level permissions.
2. Go to project `kygybgb7` → Studios and add a hosted studio; choose hostname `kygybgb7`.
3. Optionally add `appId` to `studio-aliento/sanity.cli.ts` to pin a studio channel.

If you'd like, I can attempt to re-run `npx sanity deploy -y` after you create the hosted studio or provide a user-level token with deploy rights.