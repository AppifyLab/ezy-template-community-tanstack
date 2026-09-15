# Rules for AI agents working in this app

This repo renders ONE community's public Site: `/`, `/<slug…>`, `/blog`,
`/blog/<slug>` and a 404 for anything else. Every other path on the hostname
(`/login`, `/join`, `/feeds`, `/dashboard`, `/api`, `/_next`…) is served by the
EzyCommunity platform and never reaches this code — link to those with a plain
`<a href>`, NEVER a router `<Link>`.

- Routes are file-based under `src/routes/`. `routeTree.gen.ts` is GENERATED —
  never edit or import it except from `src/router.tsx`.
- ALL data access goes through `src/lib/api.ts`, and every function there is a
  `createServerFn` server function. Outbound fetches from the deployed Worker
  are allowlisted to the community's own hostname only, and a fetch issued by
  the visitor's browser bypasses that allowlist entirely — so never call the API
  from a component, an effect, or a plain (non-server-fn) loader.
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
