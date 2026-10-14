import {createFileRoute, Link, notFound} from '@tanstack/react-router';

import {JoinBand} from '../components/join-band';
import {authorLine, Avatar} from '../components/post-card';
import {getPost} from '../lib/api';
import {formatDate, preview, readingMinutes} from '../lib/format';
import {pageTitle} from '../lib/title';
import {useSite} from './__root';

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({params}) => {
    const post = await getPost({data: {slug: params.slug}});
    if (!post) {
      // Unknown or unpublished slug under `/blog` is ours to 404 — the
      // dispatcher never sends it to the App.
      throw notFound();
    }
    return post;
  },
  head: ({loaderData, matches}) => ({
    meta: loaderData
      ? [
          {title: pageTitle(matches, loaderData.title)},
          {name: 'description', content: preview(loaderData.excerpt, loaderData.content)},
          {property: 'og:title', content: loaderData.title},
          ...(loaderData.coverUrl
            ? [{property: 'og:image', content: loaderData.coverUrl}]
            : []),
        ]
      : [],
  }),
  component: BlogPost,
});

function BlogPost() {
  const post = Route.useLoaderData();
  const site = useSite();
  const subtitle = preview(post.excerpt, undefined, 240);

  return (
    <main>
      <article className="wrap narrow section post">
        <header className="post-head">
          <h1>{post.title}</h1>
          {subtitle && <p className="subtitle post-subtitle">{subtitle}</p>}
          <div className="byline">
            <span className="avatars">
              {post.authors.map(author => (
                <Avatar key={author.id} author={author} size={36} />
              ))}
            </span>
            <span>
              {/* Names only. A member's email is never sent to the browser. */}
              <span className="byline-name">{authorLine(post.authors)}</span>
              <span className="meta">
                {[formatDate(post.publishedAt), `${readingMinutes(post.content)} min read`]
                  .filter(Boolean)
                  .join(' · ')}
              </span>
            </span>
          </div>
        </header>

        {post.coverUrl && <img className="post-cover" src={post.coverUrl} alt="" />}

        {/*
          Same rendering as the community's own blog page: the body is inserted
          as HTML with no sanitiser. It is rich text written by the community's
          own blog admins in the platform editor and stored as HTML — the
          platform trusts it at the same level on its own blog route.
          Deliberately no sanitiser here: adding one would strip embeds the
          editor legitimately produces AND would still be a different output
          from the App's, which is worse than matching it.
        */}
        <div className="prose" dangerouslySetInnerHTML={{__html: post.content}} />

        {(post.categories.length > 0 || post.tags.length > 0) && (
          <p className="terms">
            {post.categories.map(category => (
              <span className="chip" key={`c${category.id}`}>
                {category.name}
              </span>
            ))}
            {post.tags.map(tag => (
              <span className="chip chip-tag" key={`t${tag.id}`}>
                #{tag.name}
              </span>
            ))}
          </p>
        )}

        <p className="back">
          <Link to="/blog">← All posts</Link>
        </p>
      </article>

      <JoinBand name={site?.name ?? 'Community'} />
    </main>
  );
}
