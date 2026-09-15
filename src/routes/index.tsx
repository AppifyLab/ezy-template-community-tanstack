import {createFileRoute, Link} from '@tanstack/react-router';

import {BrandMark} from '../components/brand';
import {PostCard} from '../components/post-card';
import {listPosts} from '../lib/api';
import {useSite} from './__root';

export const Route = createFileRoute('/')({
  loader: async () => await listPosts({data: {limit: 3}}),
  component: Home,
});

/** CTAs into the platform App: always plain <a>, never <Link> — see __root. */
function AppLinks() {
  return (
    <div className="actions">
      <a className="button" href="/join">
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
  const {posts} = Route.useLoaderData();
  const site = useSite();
  const name = site?.name ?? 'Community';

  return (
    <main>
      <section className="hero">
        <div className="wrap center">
          <BrandMark site={site} size={72} />
          <h1>{name}</h1>
          {/*
            `initial-data` carries no description, so there is no tagline to
            read — this line IS the tagline until the platform exposes one.
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
