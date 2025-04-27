declare namespace Cloudflare {
	interface Env {
		PASSKEYS_TENANT_ID: string
    PASSKEYS_SECRET_API_KEY: string
	}
}
interface Env extends Cloudflare.Env {}
