export function getName(metaUrl: string): string {
  const path = new URL(metaUrl).pathname;
  const last = path.split('/').pop() || '';
  return last.replace(/\.[^/.]+$/, '');
}