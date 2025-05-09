export function getAuthUrl(redirectUri: string, clientId: string): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/drive.readonly",
    access_type: "offline",
    prompt: "consent",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeCode(
  code: string,
  redirectUri: string,
  env: Env,
): Promise<{ refresh_token: string }> {
  const params = new URLSearchParams({
    code,
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Google token exchange error:", errorText);
    throw new Error("Failed to exchange code");
  }
  const data = (await res.json()) as { refresh_token: string };
  return { refresh_token: data.refresh_token };
}

async function getAccessToken(env: Env, refreshToken: string): Promise<string> {
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  if (!res.ok) throw new Error("Failed to refresh access token");
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export type DriveFile = {
  id: string;
  name: string;
  modifiedTime: string;
  driveId: string;
};

export async function listFiles(env: Env, refreshToken: string): Promise<DriveFile[]> {
  const accessToken = await getAccessToken(env, refreshToken);
  const res = await fetch(
    "https://www.googleapis.com/drive/v3/files?" +
      // show docs in My Drive or shared with you
      "corpora=allDrives&includeItemsFromAllDrives=true&" +
      "q=trashed=false and mimeType='application/vnd.google-apps.document'&" +
      "fields=files(id,name,modifiedTime)",
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!res.ok) throw new Error("Failed to list files");
  const data = (await res.json()) as { files: DriveFile[] };
  return data.files;
}

export async function listFilesInDrive(
  env: Env,
  refreshToken: string,
  driveId: string,
): Promise<DriveFile[]> {
  const accessToken = await getAccessToken(env, refreshToken);
  const url = new URL("https://www.googleapis.com/drive/v3/files");
  url.searchParams.set("corpora", "drive");
  url.searchParams.set("driveId", driveId);
  url.searchParams.set("includeItemsFromAllDrives", "true");
  url.searchParams.set("supportsAllDrives", "true");
  url.searchParams.set("q", "trashed=false and mimeType='application/vnd.google-apps.document'");
  url.searchParams.set("fields", "files(id,name,modifiedTime)");
  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Google Drive API error:", errorText);
    throw new Error(`Failed to list files in drive: ${errorText}`);
  }
  const { files } = (await res.json()) as { files: DriveFile[] };
  return files;
}

export async function downloadAsMarkdown(
  env: Env,
  fileId: string,
  refreshToken: string,
): Promise<string> {
  const accessToken = await getAccessToken(env, refreshToken);
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/markdown`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  if (!res.ok) throw new Error("Failed to download file as markdown");
  return await res.text();
}

export async function getFileMetadata(
  env: Env,
  fileId: string,
  refreshToken: string,
): Promise<{ name: string }> {
  const accessToken = await getAccessToken(env, refreshToken);
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=name`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to fetch file metadata");
  return (await res.json()) as { name: string };
}

export type Drive = {
  id: string;
  name: string;
};

export async function listDrives(env: Env, refreshToken: string): Promise<Drive[]> {
  const accessToken = await getAccessToken(env, refreshToken);
  const res = await fetch("https://www.googleapis.com/drive/v3/drives?fields=drives(id,name)", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to list drives");
  const data = (await res.json()) as { drives: Drive[] };
  return data.drives;
}

export async function getDriveFileCount(
  env: Env,
  driveId: string,
  refreshToken: string,
): Promise<number> {
  const accessToken = await getAccessToken(env, refreshToken);
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q='${driveId}' in parents and mimeType='application/vnd.google-apps.document'&fields=files(id)&pageSize=1`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  if (!res.ok) throw new Error("Failed to get drive file count");
  const data = (await res.json()) as { files: { id: string }[] };
  return data.files.length;
}
