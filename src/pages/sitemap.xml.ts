import type { APIRoute } from 'astro';
import { absUrl } from '../lib/site';
import { content } from '../lib/content';

// The one page of the site. Built from SITE_URL, so a domain change needs only lib/site.ts.
export const GET: APIRoute = () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${absUrl('/')}</loc>
    <lastmod>${content._meta.updated}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
