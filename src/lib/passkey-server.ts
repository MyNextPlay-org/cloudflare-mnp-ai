import { tenant } from '@teamhanko/passkeys-sdk'

export function getPasskeyApi(env: Env) {
  const { PASSKEYS_TENANT_ID, PASSKEYS_SECRET_API_KEY } = env
  if (!PASSKEYS_TENANT_ID) {
    throw new Error('Missing PASSKEYS_TENANT_ID')
  }
  if (!PASSKEYS_SECRET_API_KEY) {
    throw new Error('Missing PASSKEYS_SECRET_API_KEY')
  }
  return tenant({ tenantId: PASSKEYS_TENANT_ID, apiKey: PASSKEYS_SECRET_API_KEY })
}
