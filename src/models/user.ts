import { generateSecret } from "../helpers/crypto";
import { getDb } from "../helpers/db";

export type User = {
  email: string;
  token: string | null;
  magic_token: string | null;
  magic_token_expires_at: string | null;
  verified: boolean;
  registered: boolean;
  drive_refresh_token: string | null;
  drive_connected: boolean;
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
      drive_connected: false,
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

/** Mark a user as registered by email */
export async function setRegisteredByEmail(env: Env, email: string): Promise<number> {
  const [result] = await getDb(env)
    .updateTable("users")
    .set({ registered: true })
    .where("email", "=", email)
    .execute();
  return Number(result.numUpdatedRows);
}

/** Set Google Drive tokens for a user */
export async function setDriveTokens(
  env: Env,
  email: string,
  refreshToken: string,
): Promise<number> {
  const [result] = await getDb(env)
    .updateTable("users")
    .set({ drive_refresh_token: refreshToken })
    .where("email", "=", email)
    .execute();
  return Number(result.numUpdatedRows);
}

/** Mark a user as connected to Google Drive */
export async function markDriveConnected(env: Env, email: string): Promise<number> {
  const [result] = await getDb(env)
    .updateTable("users")
    .set({ drive_connected: true })
    .where("email", "=", email)
    .execute();
  return Number(result.numUpdatedRows);
}

/** List all users */
export async function listUsers(env: Env): Promise<User[]> {
  return getDb(env).selectFrom("users").selectAll().execute();
}

/** Create a new user */
export async function createUser(env: Env, email: string): Promise<void> {
  await getDb(env)
    .insertInto("users")
    .values({
      email,
      token: null,
      magic_token: null,
      magic_token_expires_at: null,
      verified: false,
      registered: false,
      drive_refresh_token: null,
      drive_connected: false,
    })
    .execute();
}

/** Delete a user by email */
export async function deleteUser(env: Env, email: string): Promise<number> {
  const [result] = await getDb(env).deleteFrom("users").where("email", "=", email).execute();
  return Number(result.numDeletedRows);
}
