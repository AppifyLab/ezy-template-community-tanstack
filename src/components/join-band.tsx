import {content, fill} from '../content/site';

/**
 * The "join" call to action. `/join` and `/login` belong to the platform App on
 * this same hostname — plain <a>, never a router <Link> (see __root).
 */
export function JoinBand({name}: {name: string}) {
  return (
    <section className="join-band">
      <div className="wrap narrow center">
        <h2>{fill(content.home.joinTitle, name)}</h2>
        <p className="lede">{fill(content.home.joinBody, name)}</p>
        <div className="actions">
          <a className="button" href="/join">
            Join for free
          </a>
          <a className="button ghost" href="/login">
            Log in
          </a>
        </div>
      </div>
    </section>
  );
}
