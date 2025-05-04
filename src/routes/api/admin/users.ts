import { requireAuth } from "../../../helpers/auth";
import { listUsers, createUser, deleteUser } from "../../../models/user";

export const GET = async (request: Request, env: Env) => {
  try {
    await requireAuth(request, env);
    const users = await listUsers(env);
    return new Response(JSON.stringify(users), { headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }
};

export const POST = async (request: Request, env: Env) => {
  try {
    await requireAuth(request, env);
    const { email } = (await request.json()) as { email: string };
    await createUser(env, email);
    return new Response("{}", { headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }
};

export const DELETE = async (request: Request, env: Env) => {
  try {
    await requireAuth(request, env);
    const url = new URL(request.url);
    const email = url.pathname.split("/").pop();
    await deleteUser(env, email!);
    return new Response("{}", { headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }
};
