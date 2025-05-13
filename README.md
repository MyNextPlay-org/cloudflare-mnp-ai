# cloudflare-template

A full-stack starter for building next-gen Cloudflare Workers apps using:

- ⚡️ **Cloudflare Workers**
- 📦 **D1** (remote & local SQLite-compatible DB)
- ✉️ **Resend** (email)
- 🔐 **Passkeys** (via Hanko)
- 🧠 **Vector search + AI**
- 📂 **Google Drive OAuth**
- 🗝️ **GitHub OAuth**

All-in-one local development. Automatic deploys via Cloudflare GitHub integration. First-class support for Workflows, background jobs, and structured AI features.

---

## 🚀 Quick Start

### 1. Clone & install

```bash
git clone https://github.com/respond-run/cloudflare-template.git
cd cloudflare-template
npm ci
```

---

## 🔑 External Integrations

External keys must be added to both `.dev.vars` (for development) and via `wrangler secret put` (for production).

### Hanko (Passkeys)

1. Go to [hanko.io](https://hanko.io) and create a tenant
2. Copy:

   - `Tenant ID` → `PASSKEYS_TENANT_ID`
   - `Secret API Key` → `PASSKEYS_SECRET_API_KEY`

3. Add both to `.dev.vars` and set them as secrets

### Google OAuth (Drive)

1. In the [Google Cloud Console](https://console.cloud.google.com):

   - Enable the **Google Drive API**
   - Create OAuth 2.0 Web credentials

2. Set the redirect URI to:

   ```
   https://yourdomain.com/auth/google/callback
   ```

3. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to `.dev.vars` and set them as secrets

### Resend (Email)

1. Go to [resend.com](https://resend.com)
2. Create an account and generate your `RESEND_API_KEY`
3. Set up a verified sender domain (e.g. `hello@yourdomain.com`)
4. Add the key to `.dev.vars` and set it as a secret

---

## 🔧 Configure Credentials

### 2. Set up `.dev.vars`

```bash
cp .dev.vars.example .dev.vars
```

Fill in the following values:

```env
PASSKEYS_TENANT_ID=your-hanko-tenant-id
PASSKEYS_SECRET_API_KEY=your-hanko-secret-api-key
RESEND_API_KEY=your-resend-api-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. Set secrets for production

```bash
npx wrangler secret put PASSKEYS_TENANT_ID
npx wrangler secret put PASSKEYS_SECRET_API_KEY
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET
```

---

## ☁️ Set up Cloudflare Resources

> These only need to be created once.

### 4. Authenticate with Cloudflare

```bash
npx wrangler login
```

### 5. Create and migrate D1

#### Remote D1

```bash
npx wrangler d1 create template
```

Copy the `database_id`, `database_name`, and update the `d1_databases` entry in `wrangler.jsonc`.

##### Apply Migrations

```bash
npx wrangler d1 migrations apply template --remote
```

#### Local D1

No setup required — the dev server will automatically use a local SQLite-compatible D1 instance.

##### Apply Migrations

```bash
npx wrangler d1 migrations apply template --local
```

### 6. Create a Vectorize index

```bash
npx wrangler vectorize create [index-name] --dimensions=1024 --metric=cosine
```

Update the `vectorize` section in `wrangler.jsonc` with the new `index_name`.

---

## 💻 Local Development

```bash
npm run dev
```

This starts:

- Vite frontend
- Cloudflare Worker with:
  - Local D1
  - Live reload
  - `.dev.vars` autoloaded

In development, Workers, D1, and Workflows run locally. Vectorize and AI run remotely.

---

## 🚢 Deployments

Deployment is automatic via Cloudflare's GitHub integration:

- Push to `main` → build + deploy
- DNS and SSL are configured automatically

---

## 📦 Scripts

| Script            | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`     | Local dev (Worker + Vite + D1) |
| `npm run build`   | Production build               |
| `npm run preview` | Preview the production build   |
| `npm run test`    | Run Vitest tests               |
| `npm run types`   | Generate Wrangler types        |
| `npm run update`  | Bump dependencies              |

---

## ✅ Final Checklist

- [ ] Clone and install dependencies
- [ ] Connect repo to Cloudflare via GitHub
- [ ] Configure Hanko, Google OAuth, and Resend
- [ ] Set `.dev.vars` and Wrangler secrets
- [ ] Create D1 database (remote only)
- [ ] Create Vectorize index
- [ ] Update bindings in `wrangler.jsonc`
- [ ] Run migrations (local + remote)
- [ ] Run `npm run dev` to start building
