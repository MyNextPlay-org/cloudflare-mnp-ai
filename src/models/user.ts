import { generateSecret } from "../helpers/crypto";
import { getDb } from "../helpers/db";

export type User = {
  email: string;
  token: string | null;
  magic_token: string | null;
  magic_token_expires_at: string | null;
  verified: boolean;
  registered: boolean;
};

/** Find a verified user by email */
export async function findByEmail(env: Env, email: string): Promise<User | undefined> {
  return getDb(env).selectFrom("users").selectAll().where("email", "=", email).executeTakeFirst();
}

/** Find a verified user by token */
export async function findByToken(env: Env, token: string): Promise<User | undefined> {
  return getDb(env).selectFrom("users").selectAll().where("token", "=", token).executeTakeFirst();
}

/** Find a verified user by token */
export async function findByMagicToken(env: Env, magicToken: string): Promise<User | undefined> {
  return getDb(env)
    .selectFrom("users")
    .selectAll()
    .where("magic_token", "=", magicToken)
    .executeTakeFirst();
}

/** Upsert a magic token (signup flow) */
export async function upsertMagicToken(
  env: Env,
  email: string,
  magicToken: string,
  expiresAt: string,
): Promise<void> {
  await getDb(env)
    .insertInto("users")
    .values({
      email,
      token: generateSecret(),
      magic_token: magicToken,
      magic_token_expires_at: expiresAt,
      verified: false,
      registered: false,
    })
    .onConflict((oc) =>
      oc.column("email").doUpdateSet({
        magic_token: magicToken,
        magic_token_expires_at: expiresAt,
      }),
    )
    .execute();
}

/** Mark a user verified and clear tokens */
export async function verifyByMagicToken(
  env: Env,
  magicToken: string,
  nowIso: string,
): Promise<number> {
  // execute() on D1 yields an array of UpdateResult
  const [result] = await getDb(env)
    .updateTable("users")
    .set({
      verified: true,
      magic_token: null,
      magic_token_expires_at: null,
    })
    .where("magic_token", "=", magicToken)
    .where("magic_token_expires_at", ">", nowIso)
    .execute();

  // now result is a single UpdateResult, so numUpdatedRows exists
  return Number(result.numUpdatedRows);
}
