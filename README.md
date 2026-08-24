This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Database & Auth Setup

This project uses **Prisma 7** (PostgreSQL, via `@prisma/adapter-pg`) and **NextAuth / Auth.js v5** (credentials login, JWT sessions, role-based routing for `STUDENT` / `ADMIN`).

### Local development

Prisma 7 can run a real local Postgres instance for you — no Docker required:

```bash
npm run db:dev      # starts a local Postgres server in the background
npm run db:migrate  # applies prisma/schema.prisma to it (first run only, or after schema changes)
npm run db:seed     # creates the ADMIN user + the 2 courses
npm run dev          # start the Next.js app
```

`npm run db:dev` prints a connection string the first time — it's already wired into `.env`'s `DATABASE_URL` for you. To stop/restart it: `npx prisma dev stop` / `npm run db:dev`. `npm run db:studio` opens Prisma Studio (a GUI to browse/edit rows) against whichever `DATABASE_URL` is set.

> **Known quirk:** `prisma dev`'s local database is named `template1` by default, which is Postgres's own default template for `CREATE DATABASE` — so `migrate dev`'s shadow database can accidentally clone your real schema into itself and fail with "type already exists". If that happens, either use `npx prisma db push` instead (no shadow DB needed) or point `SHADOW_DATABASE_URL` (already set in `.env`) at a dedicated database created with `CREATE DATABASE prisma_shadow TEMPLATE template0;`. In our own testing in a sandboxed environment, this local database occasionally lost schema changes between sessions (data stayed intact) — if `next dev` throws a Prisma "column does not exist" error, run `npx prisma db push` again to resync.

### Swapping in Railway Postgres (production)

1. Create a Postgres database on [Railway](https://railway.app) and copy its connection string.
2. Replace `DATABASE_URL` in your **production environment's** env vars (Railway project settings, Vercel/host env vars, etc. — not the committed `.env`, which stays local-only) with that connection string.
3. Set a real `AUTH_SECRET` (`openssl rand -base64 32`) and `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` / `ADMIN_PHONE` for the environment you're seeding.
4. Run against that environment:
   ```bash
   npx prisma migrate deploy   # applies committed migrations (prisma/migrations/)
   npx prisma db seed          # creates the admin user + courses
   ```
5. Nothing in the application code needs to change — `src/lib/prisma.ts` reads `DATABASE_URL` from the environment at runtime.

**Local admin login** (from the seed defaults in `.env` — change these before deploying anywhere real): `admin@trinetraa.in` / `Trinetraa@Admin123`.

## Payments — Razorpay

Registration + payment is a single flow: `/register` creates the account, then redirects to `/register/payment` where Razorpay Checkout opens. A `Registration` row is created at that point (`PENDING_PAYMENT`) and only flips to `PAID` after the payment signature is verified server-side — the frontend is never trusted alone.

### Env vars to fill in (`.env.local`)

| Variable | Where to get it |
|---|---|
| `RAZORPAY_KEY_ID` | Razorpay Dashboard → Settings → API Keys → **Generate Test Key** |
| `RAZORPAY_KEY_SECRET` | Same screen — shown once, copy it immediately |
| `RAZORPAY_WEBHOOK_SECRET` | Dashboard → Settings → Webhooks → Add New Webhook → set **URL** to `https://<your-domain>/api/webhooks/razorpay` (needs a public URL — use `ngrok`/similar for local testing), subscribe to `payment.captured` and `payment.failed`, then set a secret there and paste the same value here |

These three all live in `.env.local` (gitignored), not the Prisma-specific `.env` — Next.js loads both automatically.

### Checklist: simulating a successful payment in test mode

1. Make sure `.env.local` has real **test-mode** keys (`rzp_test_...`) — the checkout won't open with the placeholder values.
2. `npm run dev`, go to `/register`, sign up, pick a course → you land on `/register/payment`.
3. Click **Pay ₹X Now**. The Razorpay popup opens.
4. In the popup, choose **Card** and enter:
   - Card number: `4100 2800 0000 1007` (Visa, Razorpay's documented **domestic** test card — generic numbers like `4111 1111 1111 1111` get rejected as non-domestic by their test-mode simulation)
   - Expiry: any future date (e.g. `12/30`)
   - CVV: any 3 digits (e.g. `123`)
   - Name: anything
5. If prompted for an OTP: **4–10 digits** (e.g. `123456`) simulates success.
6. You should land on `/dashboard?payment=success` with the registration showing **Paid** and a receipt (amount, payment ID, date).
7. To test a **failed** payment: same card, but enter an OTP of **3 digits or fewer** (e.g. `12`) — Razorpay's mock bank page uses OTP length as the success/failure switch. The registration stays `PENDING_PAYMENT`/flips to `FAILED` and the UI shows a "Try Again" button.
8. To test the **webhook backup path**: close the Razorpay popup right after submitting the card (before it redirects back) — the `handler` callback never fires, but Razorpay's `payment.captured` webhook still arrives and should flip the registration to `PAID` on its own within a few seconds (needs step 3's webhook URL to be reachable, e.g. via `ngrok http 3000`).
9. Check `/admin` as the seeded admin — the registration, amount paid, and Razorpay payment ID should all show up in the read-only table, and the revenue stat card should reflect it.

Razorpay's full test card reference (other banks, UPI, netbanking test flows) is at [razorpay.com/docs/payments/payments/test-card-upi-details](https://razorpay.com/docs/payments/payments/test-card-upi-details/).

## Deploying to Railway

### How migrations run automatically

`railway.json` sets a `preDeployCommand` (`npm run db:migrate:deploy`, i.e. `prisma migrate deploy`) — Railway runs this after every build, with full access to your env vars and the private network, and **aborts the deploy if it fails** rather than shipping code against a stale schema. `postinstall` runs `prisma generate` so the generated client exists before `next build` needs it (the `build` script also runs it defensively). No shadow database is needed in production — `migrate deploy` just applies whatever's pending in `prisma/migrations/`.

### Environment variables (set in Railway's dashboard, not committed)

| Variable | Value |
|---|---|
| `DATABASE_URL` | Railway's generated Postgres connection string (auto-available if you add a Postgres service in the same project — reference it as `${{Postgres.DATABASE_URL}}` instead of retyping it) |
| `AUTH_SECRET` | A fresh secret — **do not reuse the local dev one committed to `.env`.** Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `AUTH_URL` | `https://trinetraa.in` — optional (the app has `trustHost: true`, so it infers the URL from request headers), but explicit is safer behind a proxy |
| `RAZORPAY_KEY_ID` | Your test-mode key ID (`rzp_test_...`) — do **not** switch to live keys until you've verified the deployed site end-to-end |
| `RAZORPAY_KEY_SECRET` | Your test-mode key secret |
| `RAZORPAY_WEBHOOK_SECRET` | Set when you create the webhook in Razorpay's dashboard (see below) |

`SHADOW_DATABASE_URL` and the `ADMIN_*` vars are **not** needed here — the former is local-dev-only, and the admin account gets seeded once manually (see below), not on every deploy.

### One-time production seed (creates the admin account)

Run this from your own machine, pointed at Railway's `DATABASE_URL` (copy it from Railway's dashboard into a one-off shell, don't commit it):

```bash
DATABASE_URL="<railway's-connection-string>" ADMIN_EMAIL="you@trinetraa.in" ADMIN_PASSWORD="<a-real-password>" npm run db:seed
```

### Razorpay webhook

Dashboard → Settings → Webhooks → Add New Webhook:
- **URL:** `https://trinetraa.in/api/webhooks/razorpay`
- **Events:** `payment.captured`, `payment.failed`
- Set a secret there, then put the same value in Railway's `RAZORPAY_WEBHOOK_SECRET`

The route verifies Razorpay's `x-razorpay-signature` header against this secret over the raw request body before touching anything — an unsigned or mismatched request gets a 400 and is never processed (see `src/app/api/webhooks/razorpay/route.ts`).

### Connecting trinetraa.in (GoDaddy)

1. In Railway, open your service → **Settings → Networking → Custom Domain** → add `trinetraa.in`. Railway will show you a record to add (type + value) — **use exactly what it shows you**, not a value from this doc, since it's generated per-project.
2. In GoDaddy → your domain → **DNS Management**, add that record.
   - If Railway gives you a **CNAME** for `www.trinetraa.in`: straightforward, add it as shown.
   - If you're pointing the bare apex `trinetraa.in` (no `www`): standard DNS doesn't allow a CNAME at the root. Check what Railway's UI offers for apex domains (it may show an A record / ALIAS-style target instead) and use that. If GoDaddy doesn't support the exact record type Railway wants, the common workaround is: point `www.trinetraa.in` at Railway via CNAME, then use GoDaddy's **Domain Forwarding** to redirect the bare `trinetraa.in` → `https://www.trinetraa.in`.
3. DNS propagation can take anywhere from a few minutes to a few hours. Railway's domain settings page shows a verification status once it sees the record.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma on Railway](https://docs.railway.com) / [Railway config-as-code reference](https://docs.railway.com/reference/config-as-code)
- [Razorpay test cards](https://razorpay.com/docs/payments/payments/test-card-details/)
