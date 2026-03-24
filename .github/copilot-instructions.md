# Project Guidelines

## Code Style

- Use TypeScript with strict typing (`tsconfig.json` has `strict: true`). Avoid `any` unless unavoidable and justified.
- Use the `@/*` path alias for imports from `src`.
- Follow the existing React split:
  - Server Components by default in `src/app/**`
  - Add `'use client'` only when hooks/browser APIs are required.
- Keep styling in Tailwind utility classes, matching existing palette/tokens (`src/lib/design-system.ts`, `src/lib/theme.ts`).
- Match existing formatting style in touched files (single quotes are common in app/components files; preserve local style when editing).

## Architecture

- Framework: Next.js App Router (`src/app/**`) with route-based pages and API handlers under `src/app/api/**`.
- Layout composition:
  - Root metadata/layout in `src/app/layout.tsx`
  - Shared shell in `src/components/layout/Layout.tsx` (Header + Footer)
- Blog content pipeline:
  - Source: `content/blog/*.mdx`
  - Build-time generation via `scripts/generate-blog-data.js`
  - Outputs: `src/lib/blog-generated.ts` and `public/blog-data.json`
  - Consumers: `src/app/blog/page.tsx`, `src/app/blog/BlogClient.tsx`, `src/app/blog/[slug]/page.tsx`

## Build and Validate

- Install dependencies: `npm install`
- Local development: `npm run dev`
- Lint: `npm run lint`
- Production build: `npm run build`
  - Note: `build` runs `prebuild` first, which regenerates blog metadata from MDX files.
- Run `npm run lint` and `npm run build` after non-trivial changes before considering work complete.

## Conventions

- Blog posts should use MDX frontmatter keys used by the generator (`title`, `date`, `excerpt`, `category`, `tags`, `author`).
- If changing blog data behavior, update both generated TypeScript and JSON expectations (build pipeline + runtime fetch usage).
- Preserve South African localization conventions already present in UI metadata and date formatting (e.g., `en_ZA`, `toLocaleDateString('en-ZA', ...)`).
- Prefer small, targeted edits; avoid broad refactors unrelated to the task.

## Environment and Pitfalls

- API route `src/app/api/posts/route.ts` depends on `GITHUB_TOKEN` for GitHub write/read operations.
- The posts API currently targets a fixed repository (`LeroyAdonis/aliento-nextjs`) and branch (`main`); do not change this without explicit request.
- Missing `content/blog` directory is handled gracefully by the prebuild script (no crash, empty generation).
- Do not add a second workspace instruction file (`AGENTS.md`) unless explicitly migrating to that format.
