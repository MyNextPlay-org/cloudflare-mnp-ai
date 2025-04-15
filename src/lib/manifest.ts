let cachedManifest: any = null;

export async function getManifest(env: Env): Promise<any | null> {
  if (cachedManifest) return cachedManifest;

  try {
    const res = await env.ASSETS.fetch('https://worker/.vite/manifest.json');
    if (res.ok) {
      cachedManifest = await res.json();
      return cachedManifest;
    }
  } catch {
    // Silent fallback for dev mode
  }

  return null;
}

export interface ClientEntry {
  scriptPath: string;
  stylePath?: string;
}

export async function getClientEntry(env: Env): Promise<ClientEntry> {
  const fallback: ClientEntry = {
    scriptPath: '/src/client.ts', // dev default
  };

  const manifest = await getManifest(env);
  const entry = manifest?.source?.['src/client']?.ts;

  if (!entry) return fallback;

  return {
    scriptPath: '/' + entry.file,
    stylePath: entry.css?.[0] && '/' + entry.css[0],
  };
}