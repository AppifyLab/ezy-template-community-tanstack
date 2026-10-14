import {createFileRoute} from '@tanstack/react-router';

import {BrandMark} from '../components/brand';
import {JoinBand} from '../components/join-band';
import {content, fill} from '../content/site';
import {pageTitle} from '../lib/title';
import {useSite} from './__root';

/** `/about` — words from `src/content/site.ts`; no API call of its own. */
export const Route = createFileRoute('/about')({
  head: ({matches}) => ({meta: [{title: pageTitle(matches, 'About')}]}),
  component: About,
});

function About() {
  const site = useSite();
  const name = site?.name ?? 'Community';
  const about = content.about;

  return (
    <main>
      <section className="wrap narrow section">
        <BrandMark site={site} size={56} />
        <h1 className="page-title">{fill(about.title, name)}</h1>
        <p className="lede">{fill(about.intro, name)}</p>
        <div className="prose">
          {about.paragraphs.map(text => (
            <p key={text}>{fill(text, name)}</p>
          ))}
        </div>
      </section>

      <section className="wrap section">
        <div className="grid grid-3 highlights">
          {about.values.map(item => (
            <div className="highlight" key={item.title}>
              <h3>{fill(item.title, name)}</h3>
              <p className="muted">{fill(item.body, name)}</p>
            </div>
          ))}
        </div>
      </section>

      <JoinBand name={name} />
    </main>
  );
}
