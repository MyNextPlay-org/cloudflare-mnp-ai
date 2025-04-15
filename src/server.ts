type Handler = (request: Request, env: Env, ctx: ExecutionContext) => Promise<Response>;
type RouteModule = { [method: string]: Handler | undefined };

// Preload all route modules with Vite's import.meta.glob
const routeMap = Object.entries(
  import.meta.glob('./routes/**/*.ts', { eager: false })
).map(([filePath, loader]) => {
  // Remove prefix
  let routePath = filePath.replace(/^\.\/routes/, '').replace(/\.ts$/, '');

  // Convert index.ts to parent path
  if (routePath.endsWith('/index')) {
    routePath = routePath.replace(/\/index$/, '') || '/';
  }

  const paramNames: string[] = [];
  const regex = new RegExp('^' + routePath.replace(/\[(\w+)\]/g, (_, name) => {
    paramNames.push(name);
    return '([^/]+)';
  }) + '$');

  return { filePath, loader, regex, paramNames };
});

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/$/, '') || '/';
    const method = request.method.toUpperCase();

    for (const { regex, paramNames, loader } of routeMap) {
      const match = pathname.match(regex);
      if (!match) continue;

      const params = Object.fromEntries(
        paramNames.map((key, i) => [key, match[i + 1]])
      );

      const mod = (await loader()) as RouteModule;
      const handler = mod[method];
      if (!handler) {
        return new Response('Method Not Allowed', { status: 405 });
      }

      const reqWithParams = new Proxy(request, {
        get(target, prop) {
          if (prop === 'params') return params;
          return (target as any)[prop];
        }
      });

      return handler(reqWithParams as Request & { params: Record<string, string> }, env, ctx);
    }

    return new Response('Not Found', { status: 404 });
  },
} satisfies ExportedHandler<Env>;