type Handler = (request: Request, env: Env, ctx: ExecutionContext) => Promise<Response>;
type RouteModule = { [method: string]: Handler | undefined };

interface Route {
  filePath: string;
  loader: () => Promise<RouteModule>;
  regex: RegExp;
  paramNames: string[];
}

// Compile route map once
const routeMap: Route[] = Object.entries(
  import.meta.glob('../routes/**/*.ts', { eager: false })
).map(([filePath, loader]) => {
  let routePath = filePath.replace(/^..\/routes/, '').replace(/\.ts$/, '');

  if (routePath.endsWith('/index')) {
    routePath = routePath.replace(/\/index$/, '') || '/';
  }

  const paramNames: string[] = [];
  const regex = new RegExp('^' + routePath.replace(/\[(\w+)\]/g, (_, name) => {
    paramNames.push(name);
    return '([^/]+)';
  }) + '$');

  return { filePath, loader: loader as () => Promise<RouteModule>, regex, paramNames };
});

export async function handleRoutes(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/$/, '') || '/';
  const method = request.method.toUpperCase();

  for (const { regex, paramNames, loader } of routeMap) {
    const match = pathname.match(regex);
    if (!match) continue;

    const params = Object.fromEntries(
      paramNames.map((key, i) => [key, match[i + 1]])
    );

    const mod = await loader();
    const handler = mod[method];
    if (!handler) return new Response('Method Not Allowed', { status: 405 });

    const reqWithParams = new Proxy(request, {
      get(target, prop) {
        if (prop === 'params') return params;
        return (target as any)[prop];
      }
    });

    return handler(reqWithParams as Request & { params: Record<string, string> }, env, ctx);
  }

  return new Response('Not Found', { status: 404 });
}

export function defineRoute(
  fn: (request: Request & { params: Record<string, string> }, env: Env, ctx: ExecutionContext) => Promise<Response>
) {
  return fn;
}