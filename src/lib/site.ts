// The one place for the site's absolute address. Canonical, Open Graph, JSON-LD, sitemap.xml and
// llms.txt all build their absolute URLs from SITE_URL. To move to a custom domain, change this line.
export const SITE_URL = 'https://hardik88t.github.io';

// Page title and meta description. The description is written from the bio (content-v2.json bio.short),
// at 155 characters or fewer.
export const SITE_TITLE = 'Hardik Thanth — Product engineer, apps and web';
export const SITE_DESCRIPTION =
  'Hardik Thanth is a product engineer in Ahmedabad building web and mobile apps, desktop tools and AI features, from first sketch to release.';

/** Absolute URL for a path on the site, e.g. absUrl('/llms.txt'). */
export function absUrl(pathname: string): string {
  return new URL(pathname, SITE_URL).href;
}
