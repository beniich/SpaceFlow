/**
 * Cloudflare Worker Entrypoint for BeeCarbonat
 * Serves SPA static assets with fallback
 */
export default {
  async fetch(request, env) {
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    return new Response('BeeCarbonat Worker Ready', { status: 200 });
  },
};
