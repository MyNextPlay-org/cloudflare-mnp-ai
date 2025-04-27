export function getCookieDomain(request: Request, env: Env): string {
  // allow overriding via COOKIE_DOMAIN env var (e.g. ".example.com")
  if (env.COOKIE_DOMAIN) {
    return `Domain=${env.COOKIE_DOMAIN}; `
  }
  const hostname = new URL(request.url).hostname
  const parts = hostname.split('.')
  const base = parts.slice(-2).join('.')  // e.g. "worker.dev"
  return `Domain=.${base}; `
}
