export function getCookieDomain(request: Request): string {
  const url = new URL(request.url);
  const hostname = url.hostname;
  let cookieDomain = '';
  if (hostname.includes('.')) {
    // This converts "auth.worker.dev" to ".worker.dev"
    cookieDomain = `Domain=${hostname.replace(/^[^.]+\./, '.')}; `;
  }
  return cookieDomain
}
