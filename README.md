# Yanqing (Rose) Liu — Personal Website

PhD-application personal site for an HCI researcher. Tone: **research-first, design-sensitive, calm but memorable.** Low-saturation blue/pink palette with restrained, concept-driven three.js (a Hero signal particle field and a 3D closed-loop research framework).

## Tech stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`)
- framer-motion (subtle scroll reveals)
- three.js + @react-three/fiber + @react-three/drei (lazy-loaded, gated)
- lucide-react (icons)

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview  # preview the production build
```

## Where to edit content

Almost everything lives in one file: [`src/content/site.ts`](src/content/site.ts).
Edit copy, projects, publications, methods, journey, and links there without
touching components. Items still needing real assets are marked `TODO(assets)`.

### Asset checklist (search `TODO(assets)`)

1. **Profile photo** — drop a file at `public/photo.jpg` (About section auto-falls back to a gradient monogram if missing).
2. **Project screenshots** — replace the placeholder SVGs in `public/projects/` with sanitized screenshots (no real user content / participant IDs / backend links).
3. **Public tool links** — set the live URL + GitHub for Rose Stats Studio and Meal Right in `projects[].links`.
4. **Social links** — set GitHub / LinkedIn / Google Scholar in `profile.socials`.
5. **Toggles** — `profile.seekingPhd` shows/hides the "seeking PhD opportunities" line.

### Research-study projects (access policy)

Projects with `accessType: "private"` (Mindful Scroll, CoSim, GenAI Parenting) do
**not** expose a live experiment URL. They render a standard note:
*"Live demo restricted due to ongoing research protocols. Screenshots and a
sanitized walkthrough are available upon request."* Keep it that way unless your
PI/IRB approves a public, data-free demo.

## 3D / accessibility behavior

3D is intentionally restrained and **automatically disabled** when the visitor
prefers reduced motion, is on a small/touch screen, or has a low-core device
(see [`src/hooks/useEnable3D.ts`](src/hooks/useEnable3D.ts)). In those cases the
Hero shows a static gradient and the closed-loop becomes an accessible 2D SVG.
The three.js bundle is code-split, so it is never downloaded in fallback mode.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. In [Vercel](https://vercel.com) → **New Project** → import the repo.
3. Framework preset: **Vite** (root directory: repo root). Build command
   `npm run build`, output `dist/` — auto-detected.
4. Deploy. `vercel.json` already adds the SPA rewrite.
5. (Optional) **Settings → Domains** to attach a custom domain (e.g. `yanqingliu.com`).
