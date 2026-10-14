import type { APIRoute } from 'astro';
import { absUrl } from '../lib/site';

// AI crawlers are allowed on purpose. To block one, change its "Allow: /" to "Disallow: /" below.
// A crawler with no block of its own falls under "User-agent: *", which is also allowed.
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
];

export const GET: APIRoute = () => {
  const blocks = AI_CRAWLERS.map((ua) => `User-agent: ${ua}\nAllow: /\n`).join('\n');
  const text = `# robots.txt for ${absUrl('/')}
# AI assistants and crawlers below are allowed. To block one, change its "Allow: /" to "Disallow: /".

${blocks}
User-agent: *
Allow: /

Sitemap: ${absUrl('/sitemap.xml')}
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
