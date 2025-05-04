import { parseTokenCookie } from "./cookies";
import { findByToken } from "../models/user";

export async function requireAuth(request: Request, env: Env) {
  const token = parseTokenCookie(request);
  if (!token) throw new Error("Not authenticated");
  const user = await findByToken(env, token);
  if (!user) throw new Error("Not authenticated");
  return user;
}
