# Rules for AI agents working in this app

- Routes are file-based under `src/routes/`. `routeTree.gen.ts` is GENERATED —
  never edit or import it except from `src/router.tsx`.
- Server-side code (loaders, server functions) runs in Node: relative fetch
  URLs throw ERR_INVALID_URL there. Call the platform API as
  `${process.env.EZY_SITE_URL ?? ''}/api/...` — the env is set by the
  platform on the server and empty in the browser, where relative URLs work.
- Do not add a base path or asset prefix: the Preview serves this app at `/`
  on its own origin, exactly like production.
- Keep `vite.config.ts`'s `server` block intact — the Preview's proxy needs
  `host: '0.0.0.0'` and `allowedHosts: true`.
