import {Link} from '@tanstack/react-router';

import type {PostAuthor, PostSummary} from '../lib/api';
import {formatDate, initials, preview} from '../lib/format';

/** Cover image, or a flat brand-tinted block so rows line up without one. */
export function PostCover({post, className}: {post: PostSummary; className?: string}) {
  return post.coverUrl ? (
    <img
      className={className ? `cover ${className}` : 'cover'}
      src={post.coverUrl}
      alt=""
      loading="lazy"
    />
  ) : (
    <span className={className ? `cover cover-empty ${className}` : 'cover cover-empty'} />
  );
}

/** Names only — a member's email never reaches the browser. */
export function authorLine(authors: Array<PostAuthor>): string {
  return authors.map(author => author.name).join(', ');
}

export function Avatar({author, size = 24}: {author: PostAuthor; size?: number}) {
  return author.avatar ? (
    <img className="avatar" src={author.avatar} alt="" width={size} height={size} />
  ) : (
    <span
      className="avatar avatar-fallback"
      style={{width: size, height: size, fontSize: size * 0.4}}
      aria-hidden="true">
      {initials(author.name)}
    </span>
  );
}

function Meta({post}: {post: PostSummary}) {
  const by = authorLine(post.authors);
  const when = formatDate(post.publishedAt);
  return (
    <p className="meta">
      {[by, when].filter(Boolean).join(' · ')}
    </p>
  );
}

/** The newest post, big: cover on top, title, subtitle, byline. */
export function FeaturedPost({post}: {post: PostSummary}) {
  return (
    <Link className="featured" to="/blog/$slug" params={{slug: post.slug}}>
      <PostCover post={post} className="featured-cover" />
      <div className="featured-body">
        <h2>{post.title}</h2>
        <p className="subtitle">{preview(post.excerpt, undefined, 220)}</p>
        <Meta post={post} />
      </div>
    </Link>
  );
}

/** A newsletter-style row: words on the left, a small thumbnail on the right. */
export function PostRow({post}: {post: PostSummary}) {
  return (
    <Link className="post-row" to="/blog/$slug" params={{slug: post.slug}}>
      <div className="post-row-body">
        <h3>{post.title}</h3>
        <p className="subtitle small">{preview(post.excerpt, undefined, 140)}</p>
        <Meta post={post} />
      </div>
      {post.coverUrl && <PostCover post={post} className="post-row-thumb" />}
    </Link>
  );
}
