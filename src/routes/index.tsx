import {createFileRoute, Link} from '@tanstack/react-router';

import {BrandMark} from '../components/brand';
import {PostCard, PostCover, PostRow} from '../components/post-card';
import {listPosts, type PostSummary, type Site} from '../lib/api';
import {formatDate, preview} from '../lib/format';
import {parseVariant, type HomeVariant} from '../lib/variants';
import {useSite} from './__root';

export const Route = createFileRoute('/')({
  /**
   * PROTOTYPE ONLY — REMOVE ME. `?v=` picks one of three home layouts so the
   * three can be compared in a browser. The shipped template keeps whichever
   * one is chosen and drops this schema entirely.
   */
  // `v?:` — optional, so `<Link to="/">` elsewhere does not have to pass it,
  // and ABSENT stays absent: returning a default for a key the URL does not
  // have makes the router 307 to the canonical url, so a plain `/` would
  // redirect to `/?v=hero` on every visit.
  validateSearch: (search: Record<string, unknown>): {v?: HomeVariant} =>
    search.v === undefined ? {} : {v: parseVariant(search.v)},
  // The layouts differ only in presentation, so the loader does NOT depend on
  // `v`: switching variants re-renders, it does not re-fetch.
  loader: async () => await listPosts({data: {limit: 6}}),
  component: Home,
});

/** CTAs into the platform App: always plain <a>, never <Link> — see __root. */
function AppLinks({tone = 'solid'}: {tone?: 'solid' | 'quiet'}) {
  return (
    <div className="actions">
      <a className={tone === 'solid' ? 'button' : 'button ghost'} href="/join">
        Join
      </a>
      <a className="button ghost" href="/login">
        Log in
      </a>
      <a className="button link" href="/feeds">
        Open community →
      </a>
    </div>
  );
}

function Home() {
  const v = parseVariant(Route.useSearch().v);
  const {posts} = Route.useLoaderData();
  const site = useSite();

  if (v === 'magazine') {
    return <MagazineHome site={site} posts={posts} />;
  }
  if (v === 'card') {
    return <CardHome site={site} posts={posts} />;
  }
  return <HeroHome site={site} posts={posts} />;
}

/** Variant A — big brand hero above the three latest posts. */
function HeroHome({site, posts}: {site: Site | null; posts: Array<PostSummary>}) {
  const name = site?.name ?? 'Community';
  return (
    <main>
      <section className="hero">
        <div className="wrap center">
          <BrandMark site={site} size={72} />
          <h1>{name}</h1>
          {/*
            `initial-data` carries no description, so there is no tagline to
            read — the fallback line IS the tagline until the platform exposes
            one.
          */}
          <p className="lede">Welcome to {name}</p>
          <AppLinks />
        </div>
      </section>

      {posts.length > 0 && (
        <section className="wrap section">
          <div className="section-head">
            <h2>Latest from the blog</h2>
            <Link to="/blog">All posts →</Link>
          </div>
          <div className="grid grid-3">
            {posts.slice(0, 3).map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

/** Variant B — newspaper: one lead story, a column of the rest, brand sidebar. */
function MagazineHome({site, posts}: {site: Site | null; posts: Array<PostSummary>}) {
  const name = site?.name ?? 'Community';
  const [lead, ...rest] = posts;

  return (
    <main className="wrap section magazine">
      <div className="magazine-main">
        <p className="eyebrow">The {name} journal</p>
        {lead ? (
          <>
            <Link className="lead" to="/blog/$slug" params={{slug: lead.slug}}>
              <PostCover post={lead} className="cover-wide" />
              <h1>{lead.title}</h1>
              <p className="lede">{preview(lead.excerpt, undefined, 220)}</p>
              <p className="meta">{formatDate(lead.publishedAt)}</p>
            </Link>

            {rest.length > 0 && (
              <ul className="post-rows">
                {rest.map(post => (
                  <PostRow key={post.id} post={post} />
                ))}
              </ul>
            )}
          </>
        ) : (
          <>
            <h1>{name}</h1>
            <p className="lede">No stories published yet.</p>
          </>
        )}
      </div>

      <aside className="magazine-aside">
        <div className="panel">
          <BrandMark site={site} size={40} />
          <h2>{name}</h2>
          <p className="muted small">Welcome to {name}</p>
          <AppLinks tone="quiet" />
        </div>
        <div className="panel">
          <h3>More</h3>
          <p>
            <Link to="/blog">Browse every post →</Link>
          </p>
        </div>
      </aside>
    </main>
  );
}

/** Variant C — one centred card, links, and a compact post list. */
function CardHome({site, posts}: {site: Site | null; posts: Array<PostSummary>}) {
  const name = site?.name ?? 'Community';
  return (
    <main className="wrap section card-home">
      <div className="card">
        <BrandMark site={site} size={64} />
        <h1>{name}</h1>
        <p className="muted">Welcome to {name}</p>
        <AppLinks />

        {posts.length > 0 && (
          <>
            <hr />
            <ul className="post-rows tight">
              {posts.slice(0, 5).map(post => (
                <PostRow key={post.id} post={post} />
              ))}
            </ul>
            <p className="small">
              <Link to="/blog">All posts →</Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
