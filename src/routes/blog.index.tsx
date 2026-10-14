import {createFileRoute, Link} from '@tanstack/react-router';

import {JoinBand} from '../components/join-band';
import {FeaturedPost, PostRow} from '../components/post-card';
import {content, fill} from '../content/site';
import {emptyPostsPage, listPosts} from '../lib/api';
import {pageTitle} from '../lib/title';
import {useSite} from './__root';

const PER_PAGE = 10;

export const Route = createFileRoute('/blog/')({
  // `page?:` — optional, so `<Link to="/blog">` does not have to pass one, and
  // absent stays absent: defaulting a key the URL lacks makes the router 307 to
  // the canonical url, i.e. `/blog` would redirect to `/blog?page=1`.
  validateSearch: (search: Record<string, unknown>): {page?: number} =>
    search.page === undefined ? {} : {page: Math.max(1, Number(search.page) || 1)},
  loaderDeps: ({search}) => ({page: search.page ?? 1}),
  loader: async ({deps}) =>
    await listPosts({data: {page: deps.page, limit: PER_PAGE}}).catch(() =>
      emptyPostsPage(PER_PAGE, deps.page)
    ),
  head: ({matches}) => ({meta: [{title: pageTitle(matches, 'Blog')}]}),
  component: BlogIndex,
});

/** Newsletter-style archive: the newest post featured, then a list of rows. */
function BlogIndex() {
  const {posts, meta} = Route.useLoaderData();
  const site = useSite();
  const name = site?.name ?? 'Community';
  const firstPage = meta.currentPage <= 1;
  // Only page 1 features its newest post; older pages are plain rows.
  const featured = firstPage ? posts[0] : undefined;
  const rest = firstPage ? posts.slice(1) : posts;

  return (
    <main>
      <section className="wrap narrow section">
        <header className="blog-head">
          <h1>Blog</h1>
          <p className="lede">{fill(content.blog.description, name)}</p>
        </header>

        {posts.length === 0 ? (
          <p className="empty">{content.blog.empty}</p>
        ) : (
          <>
            {featured && <FeaturedPost post={featured} />}
            <div className="post-list">
              {rest.map(post => (
                <PostRow key={post.id} post={post} />
              ))}
            </div>
          </>
        )}

        {meta.lastPage > 1 && (
          <nav className="pager">
            {meta.currentPage > 1 && (
              <Link to="/blog" search={{page: meta.currentPage - 1}}>
                ← Newer
              </Link>
            )}
            <span className="muted small">
              Page {meta.currentPage} of {meta.lastPage}
            </span>
            {meta.currentPage < meta.lastPage && (
              <Link to="/blog" search={{page: meta.currentPage + 1}}>
                Older →
              </Link>
            )}
          </nav>
        )}
      </section>

      <JoinBand name={name} />
    </main>
  );
}
