export function getCookieDomain(request: Request): string {
  const hostname = new URL(request.url).hostname;
  const parts = hostname.split(".");
  // if host is "localhost" or single‐label, leave domain blank for host-only cookie
  if (parts.length >= 2) {
    // grab the last two segments
    const domain = parts.slice(-2).join(".");
    return `Domain=.${domain}; `;
  }
  return "";
}

export function parseTokenCookie(request: Request): string | null {
  const cookieHeader = request.headers.get("Cookie") || "";
  const match = cookieHeader.match(/token=([^;]+)/);
  return match ? match[1] : null;
}

export function setTokenCookie(request: Request, token: string): string {
  const domain = getCookieDomain(request);
  const secure = isSecureRequest(request) ? "Secure; SameSite=None; " : "";
  console.log(`token=${token}; Path=/; ${domain}${secure}Max-Age=${24 * 60 * 60}`);
  return `token=${token}; Path=/; ${domain}${secure}Max-Age=${24 * 60 * 60}`;
}

function isSecureRequest(request: Request): boolean {
  const proto = request.headers.get("x-forwarded-proto");
  return proto === "https";
}
