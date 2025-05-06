import { getManifestEntry } from "@respond-run/manifest";

export default async function manifest(env: Env) {
  const scriptPaths: string[] = [];
  let stylePaths: string[] = [];

  const fetchAsset = (path: string) => env.ASSETS.fetch("https://worker" + path);
  const clientManifest = await getManifestEntry("client.ts", fetchAsset);
  const stylesManifest = await getManifestEntry("styles.css", fetchAsset);

  if (clientManifest) {
    scriptPaths.push(clientManifest.file);
    if (clientManifest.css) {
      stylePaths = stylePaths.concat(clientManifest.css);
    }
  } else {
    scriptPaths.push("src/client.ts");
  }

  if (stylesManifest) {
    stylePaths.push(stylesManifest.file);
  }

  return { scriptPaths, stylePaths };
}
