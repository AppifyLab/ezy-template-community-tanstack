import {createFileRoute} from '@tanstack/react-router';

import {content, fill} from '../content/site';
import {pageTitle} from '../lib/title';
import {useSite} from './__root';

/**
 * `/contact` — details from `src/content/site.ts`. The form is a plain
 * `mailto:` form: it opens the visitor's mail app, so it needs no server and
 * no JavaScript. It only shows once `content.contact.email` is set.
 */
export const Route = createFileRoute('/contact')({
  head: ({matches}) => ({meta: [{title: pageTitle(matches, 'Contact')}]}),
  component: Contact,
});

function Contact() {
  const site = useSite();
  const name = site?.name ?? 'Community';
  const contact = content.contact;

  const cards = [
    contact.email && {label: 'Email', value: contact.email, href: `mailto:${contact.email}`},
    contact.phone && {label: 'Phone', value: contact.phone, href: `tel:${contact.phone}`},
    contact.address && {label: 'Address', value: contact.address, href: null},
  ].filter(Boolean) as Array<{label: string; value: string; href: string | null}>;

  return (
    <main className="wrap narrow section">
      <h1 className="page-title">{fill(contact.title, name)}</h1>
      <p className="lede">{fill(contact.intro, name)}</p>

      {cards.length > 0 && (
        <div className="contact-cards">
          {cards.map(card => (
            <div className="contact-card" key={card.label}>
              <p className="eyebrow">{card.label}</p>
              {card.href ? <a href={card.href}>{card.value}</a> : <p>{card.value}</p>}
            </div>
          ))}
        </div>
      )}

      {contact.email ? (
        <form
          className="contact-form"
          action={`mailto:${contact.email}`}
          method="post"
          encType="text/plain">
          <label>
            Name
            <input name="name" required autoComplete="name" />
          </label>
          <label>
            Email
            <input name="email" type="email" required autoComplete="email" />
          </label>
          <label>
            Message
            <textarea name="message" rows={6} required />
          </label>
          <button className="button" type="submit">
            Send message
          </button>
        </form>
      ) : (
        // No address configured yet: send people somewhere they can talk to us.
        <div className="contact-card">
          <p>
            The quickest way to reach {name} is inside the community — join and send us a
            message.
          </p>
          <div className="actions">
            <a className="button" href="/join">
              Join {name}
            </a>
          </div>
        </div>
      )}

      {contact.socials.length > 0 && (
        <p className="terms">
          {contact.socials.map(social => (
            <a className="chip" key={social.href} href={social.href} rel="noopener">
              {social.label}
            </a>
          ))}
        </p>
      )}
    </main>
  );
}
