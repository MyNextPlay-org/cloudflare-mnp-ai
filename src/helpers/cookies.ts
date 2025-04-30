export function getCookieDomain(request: Request): string {
  const url = new URL(request.url);
  const hostname = url.hostname;
  let cookieDomain = "";
  if (hostname.includes(".")) {
    // This converts "auth.worker.dev" to ".worker.dev"
    cookieDomain = `Domain=${hostname.replace(/^[^.]+\./, ".")}; `;
  }
  return cookieDomain;
}

export function parseTokenCookie(request: Request): string | null {
  const cookieHeader = request.headers.get("Cookie") || "";
  const match = cookieHeader.match(/token=([^;]+)/);
  return match ? match[1] : null;
}

export function setTokenCookie(request: Request, token: string): string {
  const domain = getCookieDomain(request);
  const secure = isSecureRequest(request) ? "Secure; SameSite=None; " : "";
  return `token=${token}; Path=/; ${domain}${secure}Max-Age=${24 * 60 * 60}`;
}

function isSecureRequest(request: Request): boolean {
  const proto = request.headers.get("x-forwarded-proto");
  return proto === "https";
}
