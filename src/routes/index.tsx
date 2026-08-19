import {createFileRoute} from '@tanstack/react-router';

/**
 * Server-side data fetching: code in loaders/server functions runs in Node,
 * which cannot resolve a relative URL — prefix platform API calls with
 * EZY_SITE_URL (set by the platform; empty in the browser, where relative
 * URLs resolve against the page origin).
 */
const apiBase = () =>
  typeof process === 'undefined' ? '' : (process.env.EZY_SITE_URL ?? '');

export const Route = createFileRoute('/')({
  loader: async () => {
    try {
      const res = await fetch(`${apiBase()}/api/public/site/v1/initial-data`);
      return {site: (await res.json()) as unknown};
    } catch {
      // Fine in a fresh Workspace: EZY_SITE_URL may not be set yet.
      return {site: null};
    }
  },
  component: Home,
});

function Home() {
  const {site} = Route.useLoaderData();

  return (
    <main className="hero">
      <span className="badge">TanStack Start</span>
      <h1>Your site starts here</h1>
      <p>
        Edit <code>src/routes/index.tsx</code> and watch the Preview update instantly.
        When it looks right, Go Live.
      </p>
      {site !== null && <code>{JSON.stringify(site)}</code>}
      <div className="actions">
        <a className="button" href="https://tanstack.com/start" target="_blank" rel="noreferrer">
          TanStack Start docs
        </a>
        <a className="button ghost" href="https://tanstack.com/router" target="_blank" rel="noreferrer">
          Router docs
        </a>
      </div>
    </main>
  );
}
