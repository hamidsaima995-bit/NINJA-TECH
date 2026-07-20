# BiltyVault

Digital bilty (consignment note) management for Pakistani transport and logistics businesses. Replaces the carbon-copy paper book with a searchable record that survives a lost file.

**Live:** [biltyvault-production.up.railway.app](https://biltyvault-production.up.railway.app)

---

## The problem

Transport companies in Pakistan issue a bilty for every consignment — a paper slip recording sender, receiver, goods, freight charges, and delivery status. The book gets lost, the carbon copy fades, and reconciling payments at month end means digging through a drawer.

BiltyVault keeps the same familiar bilty format but stores it digitally, so any consignment can be found by number, party name, or date in seconds.

## Features

- Create bilties with sender, receiver, goods description, quantity, and freight charges
- Automatic bilty numbering
- Search by bilty number, party name, route, or date range
- Delivery status tracking from booking through to delivered
- Freight summary per party for month-end reconciliation
- Printable bilty format matching the paper layout drivers already recognise

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite |
| Backend | Node.js, Express |
| Database | Supabase (PostgreSQL) |
| Hosting | Railway |

## Running locally

```bash
git clone https://github.com/hamidsaima995-bit/BILTYVAULT.git
cd BILTYVAULT
npm install
```

Create a `.env` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

```bash
npm run dev
```

## Status

Actively developed. Core booking, search, and status tracking are working. Camera-based document capture is in progress.

## Roadmap

- [ ] Camera capture for goods and delivery proof
- [ ] SMS delivery notifications to receivers
- [ ] Driver mobile view
- [ ] Multi-branch support

---

Built by [Saima](https://github.com/hamidsaima995-bit) — Ninja Tech
