# cloudflare-template

A full-stack starter for building next-gen Cloudflare Workers apps using:

- ⚡️ **Cloudflare Workers**
- 📦 **D1** (remote & local SQLite-compatible DB)
- ✉️ **Resend** (email)
- 🔐 **Passkeys** (via Hanko)
- 🧠 **Vector search + AI**
- 📂 **Google Drive OAuth**
- 🗝️ **GitHub OAuth**

Zero-config local development. Automatic deploys via Cloudflare GitHub integration. First-class support for Workflows, background jobs, and structured AI features.

---

## 🚀 Quick Start

### 1. Clone & install

```bash
git clone https://github.com/respond-run/cloudflare-template.git
cd cloudflare-template
npm ci
```

---

## 🔧 Configure Credentials

### 2. Set up `.dev.vars`

```bash
cp .dev.vars.example .dev.vars
```

Fill in:

```env
PASSKEYS_TENANT_ID=your-hanko-tenant-id
PASSKEYS_SECRET_API_KEY=your-hanko-secret-api-key
RESEND_API_KEY=your-resend-api-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

> You **do not** need to run `source .dev.vars`. The dev server automatically loads it.

---

## ☁️ Set up Cloudflare Resources

> These only need to be created once.

### 3. Authenticate

```bash
npx wrangler login
```

### 4. Create & migrate D1

#### Create remote D1:

```bash
npx wrangler d1 create template
```

Copy the `database_id` into `wrangler.jsonc`.

#### Local D1:

No setup required — the dev server will automatically use and manage a local SQLite-compatible DB.

To create and apply migrations:

```bash
npx wrangler d1 migrations create template init
npx wrangler d1 migrations apply template --local
npx wrangler d1 migrations apply template --remote
```

To view migrations:

```bash
npx wrangler d1 migrations list template --local
npx wrangler d1 migrations list template --remote
```

### 5. Create vector index

```bash
npx wrangler vectorize create [db-name] --dimensions=1024 --metric=cosine
```

Ensure the name matches `index_name` in the `VECTORIZE` binding in `wrangler.jsonc`.

### 6. Set secrets

```bash
npx wrangler secret put PASSKEYS_TENANT_ID
npx wrangler secret put PASSKEYS_SECRET_API_KEY
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET
```

### 7. Set up email (Resend)

In Cloudflare Dashboard:

1. Go to **Email > Integrations**
2. Add **Resend**
3. Paste your `RESEND_API_KEY`
4. Set a sender like `hello@yourdomain.com`

Confirm the `"send_email"` block in `wrangler.jsonc` matches.

---

## 🔑 External Integrations

### Hanko (Passkeys)

1. Go to [hanko.io](https://hanko.io) → Create Tenant
2. Copy:

   - `Tenant ID` → `PASSKEYS_TENANT_ID`
   - `Secret API Key` → `PASSKEYS_SECRET_API_KEY`

3. Add to `.dev.vars` and as secrets

### Google OAuth (Drive)

1. In [Google Cloud Console](https://console.cloud.google.com):

   - Enable **Drive API**
   - Create OAuth 2.0 Web credentials

2. Set redirect URI:

   ```
   https://yourdomain.com/auth/google/callback
   ```

3. Add credentials to `.dev.vars` and set as secrets

---

## 💻 Local Development

```bash
npm run dev
```

This starts:

- Vite frontend
- Cloudflare Worker with:

  - local D1
  - live reload
  - `.dev.vars` autoloaded

No extra steps required.

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
- [ ] Create D1 database (local + remote)
- [ ] Create Vectorize index
- [ ] Add D1 and Vectorize IDs to `wrangler.jsonc`
- [ ] Run migrations (local + remote)
- [ ] Set Cloudflare secrets
- [ ] Configure Resend and Hanko
- [ ] Set Google OAuth redirect URI
- [ ] Run `npm run dev` to start building
