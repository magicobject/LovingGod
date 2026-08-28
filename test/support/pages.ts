// Single source of truth for what each page should look like.
// Used by both the footer and page-content specs.
export interface SitePage {
  /** Path served by the static test server, e.g. "/index.html". */
  path: string;
  /** Substring expected in <title>. */
  titleContains: string;
  /** Text expected in the page's <h1>. */
  heading: RegExp;
}

export const PAGES: SitePage[] = [
  {
    path: '/index.html',
    titleContains: 'How to Love the Lord Your God',
    heading: /How to Love the Lord Your God/i,
  },
];
