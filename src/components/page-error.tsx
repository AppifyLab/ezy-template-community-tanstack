import {Link, useRouter} from '@tanstack/react-router';

/**
 * What a page shows if its data still fails after `api.ts`'s own fallbacks
 * (a server-function RPC dropped mid-navigation, say). Calm, in-site, with a
 * retry — never the framework's raw error screen.
 */
export function PageError() {
  const router = useRouter();
  return (
    <main className="wrap narrow section center">
      <p className="eyebrow">Hmm</p>
      <h1>This page didn’t load</h1>
      <p className="lede">Something went wrong on our side. Please try again in a moment.</p>
      <div className="actions">
        <button className="button" type="button" onClick={() => router.invalidate()}>
          Try again
        </button>
        <Link className="button ghost" to="/">
          Back to home
        </Link>
      </div>
    </main>
  );
}
