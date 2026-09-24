# Rules for AI agents working in this app

This repo renders ONE community's public Site: `/`, `/<slug…>`, `/blog`,
`/blog/<slug>` and a 404 for anything else. Every other path on the hostname
(`/login`, `/join`, `/feeds`, `/dashboard`, `/api`, `/_next`…) is served by the
EzyCommunity platform and never reaches this code — link to those with a plain
`<a href>`, NEVER a router `<Link>`.

- The platform recognises this project by `@tanstack/react-start` in
  `package.json`. Never add `astro`, `next` or another framework next to it —
  the project is then refused.
- This Template uses npm: keep `package-lock.json` committed (the Build then
  runs `npm ci`) and add no second lockfile. That is the Template's choice —
  the platform picks npm, pnpm or yarn from the lockfile, and refuses bun.
- Never add a route under an App path (`src/routes/api.*`, `login.tsx`,
  `feeds/`…) or a `robots.txt` / `sitemap.xml` (as a route or in `public/`) —
  the App owns those URLs and visitors never reach them.
- Routes are file-based under `src/routes/`. `routeTree.gen.ts` is GENERATED —
  never edit or import it except from `src/router.tsx`.
- This Template does ALL data access in `src/lib/api.ts`, and every function
  there is a `createServerFn` server function: pages arrive with their data,
  and `api.ts` decides field by field what reaches the browser. Keep it that
  way — never call the API from a component, an effect, or a plain
  (non-server-fn) loader. (The platform itself also allows browser fetches to
  relative `/api/public/...`; server-only is this Template's choice.)
- The API base is `process.env.EZY_SITE_URL` (the community's own origin, set by
  the platform), falling back to the incoming request's origin. Relative fetch
  URLs throw on the server.
- The community hostname is behind Cloudflare, which 403s a request with no
  `User-Agent`: server-side fetches must send one plus `Accept: application/json`.
- NEVER let a member email reach the browser — not rendered, not in the payload.
  `src/lib/api.ts` re-projects every API response field by field for exactly
  this reason; keep that shape rather than spreading raw JSON.
- Brand = name + logo + favicon from `/api/public/site/v1/initial-data`. That
  payload has no description and no colours; don't invent fields for them.
- Keep `vite.config.ts`'s guard around `@cloudflare/vite-plugin` and its `server`
  block intact: the plugin is only active when the PLATFORM has written a
  wrangler config, and the Preview's proxy needs `host: '0.0.0.0'` +
  `allowedHosts: true`.
- Do not add a base path or asset prefix: the app is served at `/` on its own
  origin.
- A child route's `head` only gets its OWN `loaderData`; read the community name
  from the root match via `pageTitle(matches, …)` in `src/lib/title.ts` rather
  than calling `getSite()` again for a string that is already loaded.
- No `.github/workflows/` — the site deploys from the platform (a push to the
  connected branch, or a zip upload), not from Actions.

## Platform rules

True for any code on an EzyCommunity Site, not only this Template:

- **What is built is detected from the files, and the verdict is final:**
  TanStack Start (`@tanstack/react-start`), Astro (static, or SSR with
  `@astrojs/cloudflare` only), or a root `index.html` published as-is.
  Next.js, Nuxt, SvelteKit, Remix, React Router (framework mode), Gatsby,
  Angular and un-built Vite / CRA / Eleventy source are refused. The project
  sits at the repository root (a zip may wrap it in one folder); a Node project
  has one lockfile (npm, pnpm or yarn; bun is refused). Server code runs on
  Cloudflare Workers (`nodejs_compat`), not Node.
- **The App owns** `/api`, `/login`, `/join`, `/feeds`, `/dashboard`,
  `/settings`, `/_next`, `/robots.txt`, `/sitemap.xml`,
  `/<product>/<id>/checkout` and more: a file or route there is never served
  (the dashboard lists it as a shadowed path). Link to App pages with a plain
  `<a href>`.
- **Community data comes only from its public API on its own hostname**
  (`/api/public/...`): server code builds the URL from `EZY_SITE_URL` (the
  only environment variable), browser code uses relative URLs. Deployed server
  code can reach no other host. Data fetched during the Build is frozen until
  the next Build (a Redeploy reuses the old output) — fetch at request time or
  in the browser.
- **There are no secrets.** No secret store exists: never put keys, tokens or
  passwords in code, `.env` or config — assume anything in the project can end
  up public. Never send a member's email address to the browser.
- **No deploy config.** Don't commit `wrangler.*`: the platform writes the
  Worker config and drops any KV, R2, D1 or other binding.
