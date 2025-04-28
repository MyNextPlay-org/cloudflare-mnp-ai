import {
  create,
  CredentialCreationOptionsJSON,
  CredentialRequestOptionsJSON,
  get,
} from "@github/webauthn-json";

export type PasskeyOptions =
  | ({ mode: "registration" } & CredentialCreationOptionsJSON)
  | ({ mode: "login" } & CredentialRequestOptionsJSON);

export type PasskeyFinalizeOutput =
  | { success: true; token: string }
  | { error: string; details?: string };

export async function handlePasskeyAuth(emailInput: string): Promise<PasskeyFinalizeOutput> {
  // Get and normalize the email from the input.
  if (!emailInput) throw new Error("Email input not found");
  const email = emailInput.trim().toLowerCase();

  // Start the passkey flow. The server determines if the user exists.
  const startResponse = await fetch("/passkey/start", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const options = (await startResponse.json()) as PasskeyOptions;

  // Depending on the returned mode, call the appropriate WebAuthn function.
  let credential;
  if (options.mode === "login") {
    credential = await get(options);
  } else if (options.mode === "registration") {
    credential = await create(options);
  } else {
    throw new Error("Unknown authentication mode");
  }

  // Finalize the flow by sending the credential back.
  const finalizeResponse = await fetch("/passkey/finalize", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, credential }),
  });
  const result = (await finalizeResponse.json()) as PasskeyFinalizeOutput;

  return result;
}
