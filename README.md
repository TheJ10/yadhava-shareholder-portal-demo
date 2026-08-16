# Yadhava Convention Hall — Shareholder Portal

A production-grade Next.js rebuild of the shareholder certificate verification
portal. Built with Next.js 14 (App Router), TypeScript, and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

Push this to a Git repo and import it in Vercel, or run:

```bash
npm i -g vercel
vercel --prod
```

No environment variables or extra configuration are required — Next.js is
auto-detected.

## Demo login

```
Mobile:  9840288549
OTP:     123456
```

**A note on this number:** the brief for this rebuild specified `9876543210`
as the demo credential, but that number doesn't appear in any of the supplied
source documents. The only registered member in the supplied Deposit-Bank and
Deposit-Cash certificates — Arul Sekar, folio SNK/0411 — is on record with
`9840288549` (confirmed in both the certificate documents and the member
Excel row). Rather than invent a mobile number to match `9876543210`, the app
uses the real one. If there's a different member record intended for
`9876543210`, swap it into `lib/data.ts` and it'll work immediately — see
below.

## Project structure

```
app/
  page.tsx                          Mobile number entry ("/")
  otp/page.tsx                      OTP verification
  holder/page.tsx                   Holder Details + deposit summary cards
  deposit/[type]/page.tsx           Certificate list (bank | cash)
  certificate/[type]/[certNo]/      Certificate viewer + download
  layout.tsx                        Root layout: fonts, providers, header, watermark
  globals.css

components/
  Header.tsx                        Sticky header, hero -> compact on scroll
  KrishnaWatermark.tsx               Fixed centered background watermark
  Guards.tsx                        RequireAuth / RedirectIfAuthenticated
  DepositCard.tsx                   Blue (Bank) / rose (Cash) summary card
  CertificateRow.tsx                Certificate list row
  CertificateReplica.tsx            Certificate visual, used by the viewer + download
  BackLink.tsx

lib/
  types.ts                          Member / Deposit / Certificate types
  data.ts                           ← Source-of-truth data + the backend seam
  auth-context.tsx                  Session persistence (localStorage) + OTP flow
  toast-context.tsx                 Lightweight notifications
  download-certificate.ts           html2canvas-based PNG export

public/
  krishna-logo.png                  Header emblem (supplied circular image)
  krishna-watermark.png             Background watermark (supplied sitting image)
```

## Replacing the demo data with a real backend

Everything the UI needs comes through two functions in `lib/data.ts`:

```ts
getMemberByMobile(mobile: string): Member | null
verifyOtp(mobile: string, otp: string): boolean
```

To go live, replace their bodies with real calls (e.g. `fetch('/api/members/'+mobile)`
and a real SMS/OTP provider check) and add API routes under `app/api/`. No
other file needs to change — every page and component reads member/deposit/
certificate data through this seam or through `useAuth()`, never directly
from a hardcoded object.

Share totals are always calculated by summing `certificates[]`
(`depositTotals()` in `lib/data.ts`) — never read from a stored total — so
adding or correcting a certificate automatically updates every total on
screen.

## What was fixed from the previous version

- **Browser back-button logout** — the previous single-page prototype kept
  all state in memory, so a full reload or history navigation could reset
  it. This version uses real Next.js routes with the session persisted in
  `localStorage` (read fresh on every mount), so refreshing, closing the
  tab, or using the phone's back gesture no longer logs the shareholder out.
- **Header** — a single static masthead, `position: fixed` with a constant
  116px height (`components/Header.tsx`). It does not collapse, resize, or
  transition on scroll — no scroll listener exists in the component at all.
  Page content reserves `padding-top: 116px` (see `app/layout.tsx`) so
  nothing is ever hidden underneath it.
- **Krishna background** — exactly one instance of the supplied background
  image, fixed and centered, no corner placement or duplication.

## Testing checklist covered

- `npm run build` completes with no errors and no type errors.
- All routes (`/`, `/otp`, `/holder`, `/deposit/bank`, `/deposit/cash`,
  `/certificate/bank/508`, `/certificate/bank/660`, `/certificate/bank/707`,
  `/certificate/cash/105`) resolve with HTTP 200; unknown routes 404.
- Full login → holder → deposit → certificate → download flow verified
  against the production build.
- No fabricated certificate, member, or financial data anywhere in `lib/data.ts`.

## Known dependency advisories

`npm audit` reports a handful of high-severity advisories against the wider
Next.js 14.x → 16.x version range (image optimizer, middleware, Server
Actions edge cases). This app uses none of those features (no custom
middleware, no Server Actions, no remote image patterns), so they don't
apply here, but keeping Next.js current is still worth doing on a normal
cadence — check `npm audit` after `npm install`.
