/**
 * The site's own words — everything a visitor reads that does NOT come from
 * the community API (the API gives name, logo, favicon and blog posts only).
 *
 * Edit freely. `{name}` anywhere in a string is replaced with the community's
 * name at render time (see `fill`), so the defaults read right for any site.
 */

export interface Highlight {
  title: string;
  body: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export const content = {
  home: {
    tagline: 'Stories, ideas and updates from {name} — straight to you.',
    highlightsTitle: 'What you’ll find here',
    highlights: [
      {
        title: 'Thoughtful writing',
        body: 'Long-form posts, guides and notes you can read in one sitting.',
      },
      {
        title: 'A real community',
        body: 'Join the conversation, ask questions and meet people who care about the same things.',
      },
      {
        title: 'Always up to date',
        body: 'New posts land here first. Join to never miss one.',
      },
    ] satisfies Array<Highlight>,
    joinTitle: 'Join {name}',
    joinBody: 'Get every new post and be part of the conversation. It’s free to join.',
  },

  blog: {
    description: 'Essays, updates and notes from {name}.',
    empty: 'Nothing published yet — the first post is on its way.',
  },

  about: {
    title: 'About {name}',
    intro: '{name} is a place to learn, share and grow together.',
    paragraphs: [
      'We started {name} to bring people together around ideas worth talking about. Everything we publish is written to be useful first.',
      'Whether you’re here to read, to learn or to take part, you’re welcome. Have a look around the blog, then come and say hello.',
    ],
    values: [
      {title: 'Useful', body: 'Every post should leave you with something you can use.'},
      {title: 'Open', body: 'Questions are welcome. Nobody starts as an expert.'},
      {title: 'Kind', body: 'Disagree with ideas, never with people.'},
    ] satisfies Array<Highlight>,
  },

  contact: {
    title: 'Get in touch',
    intro: 'Questions, ideas or feedback? We’d love to hear from you.',
    /** Shown as a card and used by the contact form (opens the visitor's mail app). Empty → no form. */
    email: '',
    phone: '',
    address: '',
    socials: [] as Array<SocialLink>,
  },
};

/** `{name}` → the community's name. */
export function fill(text: string, name: string): string {
  return text.replaceAll('{name}', name);
}
