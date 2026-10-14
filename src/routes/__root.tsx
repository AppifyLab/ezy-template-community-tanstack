import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from '@tanstack/react-router';

import {BrandMark} from '../components/brand';
import {NotFound} from '../components/not-found';
import {getSite, type Site} from '../lib/api';
import appCss from '../styles.css?url';

export const Route = createRootRoute({
  /**
   * The brand is fetched ONCE here and reused by every page (header, footer,
   * `<title>`, favicon, the home hero). `getSite` is a server function, so this
   * runs on the Worker on first paint and as an RPC on client navigation — the
   * browser never talks to the API itself.
   */
  // Never throws: no brand → the pages render with their fallbacks.
  loader: async () => ({site: await getSite().catch(() => null)}),
  head: ({loaderData}) => {
    const site = (loaderData as {site: Site | null} | undefined)?.site ?? null;
    return {
      meta: [
        {charSet: 'utf-8'},
        {name: 'viewport', content: 'width=device-width, initial-scale=1'},
        {title: site?.name ?? 'Community'},
      ],
      links: [
        {rel: 'stylesheet', href: appCss},
        ...(site?.favIcon ? [{rel: 'icon', href: site.favIcon}] : []),
      ],
    };
  },
  component: RootComponent,
  notFoundComponent: NotFoundRoute,
});

const NAV = [
  {to: '/', label: 'Home', exact: true},
  {to: '/blog', label: 'Blog', exact: false},
  {to: '/about', label: 'About', exact: true},
  {to: '/contact', label: 'Contact', exact: true},
] as const;

/** The brand, for any component under the root route. */
export function useSite(): Site | null {
  return Route.useLoaderData().site;
}

function NotFoundRoute() {
  return <NotFound site={useSite()} />;
}

function RootComponent() {
  const site = useSite();
  const name = site?.name ?? 'Community';

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <header className="site-header">
          <div className="wrap site-header-inner">
            <Link to="/" className="brand">
              <BrandMark site={site} />
              <span className="brand-name">{name}</span>
            </Link>
            <nav className="site-nav" aria-label="Main">
              {NAV.map(item => (
                <Link key={item.to} to={item.to} activeOptions={{exact: item.exact}}>
                  {item.label}
                </Link>
              ))}
            </nav>
            {/*
              Plain <a>, NOT <Link>: `/login` and `/join` are served by the
              platform App on this same hostname, not by this template. Routing
              them through the client router would 404 inside this app.
            */}
            <div className="site-header-actions">
              <a className="nav-login" href="/login">
                Log in
              </a>
              <a className="button small-button" href="/join">
                Join
              </a>
            </div>
          </div>
        </header>

        <Outlet />

        <footer className="site-footer">
          <div className="wrap site-footer-inner">
            <span>
              © {new Date().getUTCFullYear()} {name}
            </span>
            <nav className="footer-nav" aria-label="Footer">
              {NAV.map(item => (
                <Link key={item.to} to={item.to}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </footer>

        <Scripts />
      </body>
    </html>
  );
}
