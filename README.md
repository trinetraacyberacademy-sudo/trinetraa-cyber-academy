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
   - Card number: `4111 1111 1111 1111`
   - Expiry: any future date (e.g. `12/30`)
   - CVV: any 3 digits (e.g. `123`)
   - Name: anything
5. Submit. Razorpay's test mode auto-approves this card — no OTP needed for the standard test flow.
6. You should land on `/dashboard?payment=success` with the registration showing **Paid** and a receipt (amount, payment ID, date).
7. To test a **failed** payment instead of step 4, use card `4000 0000 0000 0002` — Razorpay declines it and the checkout shows its own failure UI; you'll land back on the payment page with a "Try Again" button and the registration stays `PENDING_PAYMENT`/`FAILED`.
8. To test the **webhook backup path**: close the Razorpay popup right after submitting the card (before it redirects back) — the `handler` callback never fires, but Razorpay's `payment.captured` webhook still arrives and should flip the registration to `PAID` on its own within a few seconds (needs step 3's webhook URL to be reachable, e.g. via `ngrok http 3000`).
9. Check `/admin` as the seeded admin — the registration, amount paid, and Razorpay payment ID should all show up in the read-only table, and the revenue stat card should reflect it.

Razorpay's full test card reference (other banks, UPI, netbanking test flows) is at [razorpay.com/docs/payments/payments/test-card-upi-details](https://razorpay.com/docs/payments/payments/test-card-upi-details/).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
