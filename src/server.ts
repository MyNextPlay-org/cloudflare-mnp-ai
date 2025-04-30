import { createRouter } from "@respond-run/router";

const globs = import.meta.glob("./routes/**/*.ts", { eager: false });
const handleRoutes = createRouter<Env, ExecutionContext>(globs);

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return handleRoutes(req, env, ctx);
  },
} satisfies ExportedHandler<Env>;

export { SignupWorkflow } from "./workflows/signup";
