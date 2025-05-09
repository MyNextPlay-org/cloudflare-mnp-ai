export type UserDrive = {
  id: string;
  user_email: string;
  drive_id: string;
  name: string;
  file_count: number;
  last_synced_at: string | null;
  created_at: string;
};

export async function listUserDrives(env: Env, userEmail: string): Promise<UserDrive[]> {
  const drives = await env.DB.prepare(
    "SELECT * FROM user_drives WHERE user_email = ? ORDER BY created_at DESC",
  )
    .bind(userEmail)
    .all();
  return drives.results as UserDrive[];
}

export async function createUserDrive(
  env: Env,
  drive: Omit<UserDrive, "created_at" | "last_synced_at">,
): Promise<void> {
  await env.DB.prepare(
    "INSERT INTO user_drives (id, user_email, drive_id, name, file_count) VALUES (?, ?, ?, ?, ?)",
  )
    .bind(drive.id, drive.user_email, drive.drive_id, drive.name, drive.file_count)
    .run();
}

export async function removeUserDrive(env: Env, id: string): Promise<void> {
  await env.DB.prepare("DELETE FROM user_drives WHERE id = ?").bind(id).run();
}

export async function updateUserDrive(
  env: Env,
  id: string,
  updates: { file_count: number; last_synced_at: string },
): Promise<void> {
  await env.DB.prepare("UPDATE user_drives SET file_count = ?, last_synced_at = ? WHERE id = ?")
    .bind(updates.file_count, updates.last_synced_at, id)
    .run();
}

export async function getUserDrive(env: Env, id: string): Promise<UserDrive | null> {
  const drive = await env.DB.prepare("SELECT * FROM user_drives WHERE id = ?").bind(id).first();
  return drive as UserDrive | null;
}
