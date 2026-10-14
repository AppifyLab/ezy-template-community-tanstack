import {createFileRoute, Link} from '@tanstack/react-router';

import {BrandMark} from '../components/brand';
import {JoinBand} from '../components/join-band';
import {FeaturedPost, PostRow} from '../components/post-card';
import {content, fill} from '../content/site';
import {emptyPostsPage, listPosts} from '../lib/api';
import {useSite} from './__root';

export const Route = createFileRoute('/')({
  // No posts reachable → the home still renders, just without the blog strip.
  loader: async () => await listPosts({data: {limit: 4}}).catch(() => emptyPostsPage(4)),
  component: Home,
});

function Home() {
  const {posts} = Route.useLoaderData();
  const site = useSite();
  const name = site?.name ?? 'Community';
  const [featured, ...rest] = posts;

  return (
    <main>
      <section className="hero">
        <div className="wrap center">
          <BrandMark site={site} size={72} />
          <h1>{name}</h1>
          <p className="lede">{fill(content.home.tagline, name)}</p>
          {/* `/join` is the platform App's: plain <a>, never <Link> — see __root. */}
          <div className="actions">
            <a className="button" href="/join">
              Join for free
            </a>
            <Link className="button ghost" to="/blog">
              Read the blog
            </Link>
          </div>
        </div>
      </section>

      <section className="wrap section">
        <h2 className="center">{fill(content.home.highlightsTitle, name)}</h2>
        <div className="grid grid-3 highlights">
          {content.home.highlights.map(item => (
            <div className="highlight" key={item.title}>
              <h3>{fill(item.title, name)}</h3>
              <p className="muted">{fill(item.body, name)}</p>
            </div>
          ))}
        </div>
      </section>

      {featured && (
        <section className="wrap narrow section">
          <div className="section-head">
            <h2>Latest posts</h2>
            <Link to="/blog">See all →</Link>
          </div>
          <FeaturedPost post={featured} />
          <div className="post-list">
            {rest.map(post => (
              <PostRow key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      <JoinBand name={name} />
    </main>
  );
}
