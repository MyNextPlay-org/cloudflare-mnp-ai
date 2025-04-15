import { handleRoutes } from "./lib/routes";

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return handleRoutes(req, env, ctx);
  },
} satisfies ExportedHandler<Env>;