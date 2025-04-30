// src/routes/login.ts
import login from "../components/login";
import { getClientEntry } from "@respond-run/manifest";
import layout from "../components/layout";
import { findByEmail } from "../models/user";

export const GET = async (_request: Request, env: Env, _ctx: ExecutionContext) => {
  const { scriptPath, stylePath } = await getClientEntry((path) =>
    env.ASSETS.fetch("https://worker" + path),
  );

  return new Response(
    layout.render({
      body: login.render(),
      title: "Login",
      scriptPath,
      stylePath,
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
