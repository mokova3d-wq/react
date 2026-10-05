# Mokova3D — React + Cloudflare backend

This is the migration from the JSON-only site to a production-oriented architecture:

- React + Vite frontend
- Cloudflare Workers API
- Cloudflare D1 SQL database
- Cloudflare R2 for uploaded media
- Secure HttpOnly admin session
- Product/category/review/banner/blog/enquiry/analytics data
- Google Sheets + email integration via one Apps Script webhook
- Existing Mokova product/review/category data included as seed source

## Local setup

```bash
npm install
npm run dev
```

For Cloudflare:

```bash
npx wrangler login
npx wrangler d1 create mokova-db
npx wrangler r2 bucket create mokova-media
```

Put the returned D1 database id into `wrangler.toml`.

Then:

```bash
npm run db:seed
npx wrangler d1 migrations apply mokova-db --remote
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put SESSION_SECRET
npm run build
npx wrangler deploy
```

For Google Sheets/email, see `GOOGLE-SHEETS-EMAIL.md` and configure `GOOGLE_APPS_SCRIPT_URL`.

## Cloudflare Pages note

The Worker uses the Cloudflare Assets binding and therefore the same Worker can serve the React build and API. You can deploy with `wrangler deploy` after configuring the D1 and R2 bindings. If you prefer Pages Git integration, use a Pages project for the frontend and deploy the Worker API separately; the React `API` constant can then be changed to the Worker URL.

## Security

Never put D1 credentials, Google credentials, admin passwords or API secrets in React code. Use Cloudflare secrets/variables. The admin session is HttpOnly and signed by the Worker.
