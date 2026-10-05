# Mokova3D Cloudflare deployment — exact order

## 1. GitHub
Create a **private** repository and upload this entire project.

## 2. Install locally
Use Node.js 18+ (current Cloudflare docs require Node 16.17+ for Wrangler).

```bash
npm install
```

## 3. Cloudflare login

```bash
npx wrangler login
```

## 4. Create D1

```bash
npx wrangler d1 create mokova-db
```

Copy the returned `database_id` into `wrangler.toml` where it currently says `REPLACE_WITH_D1_DATABASE_ID`.

## 5. Create R2

```bash
npx wrangler r2 bucket create mokova-media
```

The Worker already has the `MEDIA_BUCKET` binding.

## 6. Set secrets

```bash
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put SESSION_SECRET
```

Use a long random value for `SESSION_SECRET`.

For the Google Sheet/email webhook, set the URL in your Cloudflare Worker variables/secrets as `GOOGLE_APPS_SCRIPT_URL`.

## 7. Apply database migrations + existing Mokova data

```bash
npx wrangler d1 migrations apply mokova-db --remote
```

Migration `0002_seed.sql` contains the existing products, categories, 198 reviews, FAQ, pages, gallery, site configuration and starter blog posts.

## 8. Build

```bash
npm run build
```

## 9. Deploy

```bash
npx wrangler deploy
```

Cloudflare will return the live `workers.dev` URL.

## 10. Connect private GitHub for automatic deploys

In Cloudflare Dashboard → Workers & Pages → your Worker → Settings → Builds → Connect Git.

Select the private GitHub repository and production branch (`main`). Pushes can then trigger automatic builds/deployments.

## 11. Custom domain

After the Worker is live, add your domain in Cloudflare → Workers & Pages → your Worker → Domains & Routes.

## 12. Google Sheets + email

Follow `GOOGLE-SHEETS-EMAIL.md`. The Worker stores the enquiry in D1 first and then forwards it to the Apps Script webhook. The Apps Script appends it to Google Sheets and sends an email.

## Important

Do not commit `.dev.vars`, Cloudflare API tokens, Google credentials, admin passwords or any secret into GitHub.
