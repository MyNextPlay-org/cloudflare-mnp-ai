export function generateSecret(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  let binary = "";
  for (const byte of array) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}
