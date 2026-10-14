import type { APIRoute } from 'astro';
import { indexMd } from '../lib/agent';

export const GET: APIRoute = () =>
  new Response(indexMd(), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
