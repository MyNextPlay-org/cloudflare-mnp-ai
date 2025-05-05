// src/routes/login.ts
import login from "../components/login/login";
import { findByEmail } from "../models/user";
import layout from "../components/layout/layout";
import manifest from "../helpers/manifest";

export const GET = async (_request: Request, env: Env, _ctx: ExecutionContext) => {
  const { scriptPaths, stylePaths } = await manifest(env);

  return new Response(
    await layout.render({
      body: await login.render(),
      title: "Login",
      scriptPaths,
      stylePaths,
    }),
    {
      headers: { "Content-Type": "text/html" },
    },
  );
};

export const POST = async (request: Request, env: Env, _ctx: ExecutionContext) => {
  const { email } = (await request.json()) as { email: string };
  const user = await findByEmail(env, email);

  if (user?.verified) {
    // existing, verified user: front–end can now prompt for passkey login
    return new Response(JSON.stringify({ status: "existing" }), {
      headers: { "Content-Type": "application/json" },
    });
  } else {
    // new or unverified user: start the signup workflow
    const origin = new URL(request.url).origin;
    const instance = await env.SIGNUP_WORKFLOW.create({
      params: { email, origin },
    });

    return new Response(
      JSON.stringify({
        status: "signup_started",
        instanceId: instance.id,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
