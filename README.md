# ChainDonate Tracker

> **Cardano Decentralized Crowdfunding** — A transparent, on-chain donation platform built on the Cardano Preview Testnet.

---

## What It Does

ChainDonate Tracker is a decentralized application (DApp) that lets anyone browse, register, and donate to crowdfunding campaigns where every transaction is settled directly on the **Cardano blockchain**. There is no intermediary: donations go peer-to-peer from a donor's wallet to the campaign's target address.

### Core Features

| Feature | Description |
|---|---|
| **Campaign Dashboard** | Browse all registered campaigns in a card-grid view with real-time data from Supabase |
| **Campaign Detail Modal** | View a campaign's hero info, funding goal progress bar, donor count, and full donation history |
| **On-Chain Donations** | Send ADA directly to a campaign's Cardano wallet address via MeshSDK + Blockfrost — the transaction hash is recorded as a receipt |
| **On-Chain Confirmation Polling** | After submitting a transaction, the app polls Blockfrost every 15 seconds (up to 5 minutes) and only marks a donation as confirmed once it actually appears on-chain — submitted ≠ confirmed |
| **Treasury Support Toggle** | Optionally add 1 ADA to the platform treasury; when enabled, a single atomic transaction splits funds between the campaign and the treasury address |
| **Invoice Summary** | Pre-signing breakdown showing donation amount, optional treasury fee, and total ADA to be signed |
| **Treasury Widget** | Live view of the platform treasury balance queried directly from Blockfrost, auto-refreshing every 30 seconds |
| **Goal Enforcement** | Donation UI locks when a campaign's goal is met; completed campaigns show an archived view with a CardanoScan explorer link |
| **Campaign Registration** | Two-step flow: (1) connect a Cardano wallet and cryptographically sign a message to prove ownership (CIP-30 `signData`), then (2) fill in campaign title, description, and funding goal |
| **Real-Time Updates** | Campaign list, donation stats, and donation history update live via Supabase Realtime subscriptions without a page refresh |
| **Anti-Dust Guard** | Enforces a 1 ADA minimum donation to prevent transactions from being rejected by Cardano's UTXO minimum-value protocol rules (`BabbageOutputTooSmallUTxO`) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Wallet Integration | [MeshSDK](https://meshjs.dev/) (`@meshsdk/core`, `@meshsdk/wallet`) |
| Blockchain Data | [Blockfrost](https://blockfrost.io/) — Cardano Preview Testnet API |
| Database | [Supabase](https://supabase.com/) (PostgreSQL + Realtime) |
| Package Manager | Bun |

---

## Prerequisites

Before running the project, make sure you have:

- **Node.js** ≥ 18 or **Bun** ≥ 1.0 installed
- A **Cardano browser wallet extension** installed (see [Wallet Setup](#wallet-setup) below)
- A free **Blockfrost** account with a Preview Testnet project
- A free **Supabase** project with the required tables created

---

## Local Setup

### 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd ChainDonate

# Using Bun (recommended — project ships with bun.lock)
bun install

# Or using npm
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Blockfrost — Preview Testnet project ID
# Get yours at https://blockfrost.io → New Project → Network: Preview
NEXT_PUBLIC_BLOCKFROST_PROJECT_ID=previewXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Default donation address (Cardano Preview Testnet bech32 format)
NEXT_PUBLIC_DONATION_ADDRESS=addr_test1...

# Treasury wallet address — receives the optional 1 ADA platform fee
# Must be a valid Cardano Preview Testnet bech32 address
NEXT_PUBLIC_TREASURY_ADDRESS=addr_test1...

# Supabase — from your project's Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

> **Important:** `NEXT_PUBLIC_BLOCKFROST_PROJECT_ID` must start with `preview` — the app runs on the **Cardano Preview Testnet**, not mainnet. If `NEXT_PUBLIC_TREASURY_ADDRESS` is missing, the treasury toggle will throw an error when a user tries to use it.

### 3. Set up the Supabase database

In your Supabase project, open the SQL Editor and run:

```sql
-- Campaigns table
create table campaigns (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  target_address text not null,
  goal numeric not null,
  is_verified boolean default false,
  treasury_enabled boolean default false,
  created_at timestamptz default now()
);

-- Transactions table
-- status: 'pending' on submit, 'confirmed' once on-chain, 'failed' if polling times out
create table transactions (
  id uuid default gen_random_uuid() primary key,
  tx_hash text not null unique,
  address text not null,         -- campaign's target_address (recipient)
  amount numeric not null,       -- in ADA (not lovelace)
  campaign_id uuid references campaigns(id),
  status text default 'pending', -- 'pending' | 'confirmed' | 'failed'
  confirmed_at timestamptz,
  created_at timestamptz default now()
);

-- Enable Realtime for both tables
-- In the Supabase dashboard: Database → Replication → toggle on "campaigns" and "transactions"
```

Then configure Row Level Security (RLS) as needed, or disable it for development:

```sql
-- Development only — disable RLS for open access
alter table campaigns disable row level security;
alter table transactions disable row level security;
```

### 4. Run the development server

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Wallet Setup

ChainDonate runs on the **Cardano Preview Testnet**. You must configure your wallet for Preview — **mainnet ADA will not work** and no real funds are ever required.

### Step 1 — Install a Cardano wallet browser extension

Any CIP-30 compatible wallet works. Recommended options:

| Wallet | Link |
|---|---|
| **Eternl** | https://eternl.io |
| **Nami** | https://namiwallet.io |
| **Flint** | https://flint-wallet.com |
| **Yoroi** | https://yoroi-wallet.com |
| **Vespr** | https://vespr.xyz |

### Step 2 — Switch your wallet to Preview Testnet

- **Eternl:** Settings → Network → Preview
- **Nami:** Click your avatar → Switch Network → Preview
- **Lace/Others:** Look for a Network Selector in Settings

> ⚠️ Make sure the network says **"Preview"**, not "Preprod" or "Mainnet".

### Step 3 — Get testnet ADA (tADA)

Visit the Cardano Testnet Faucet to receive free tADA for testing:

```
https://docs.cardano.org/cardano-testnets/tools/faucet
```

Select **"Preview"** as the environment, paste your wallet's Preview address, and request funds. tADA arrives within a few minutes.

### Step 4 — Connect in ChainDonate

1. Open the app at `http://localhost:3000`
2. Use the **wallet selector** in the top-right navbar
3. Select your installed wallet from the dropdown and click **Connect**
4. Approve the connection prompt in your wallet extension

Once connected, your shortened address will appear with a pulsing green indicator.

---

## Registering a Campaign

1. Click **"Register Campaign"** on the dashboard
2. **Step 1 — Wallet Ownership Proof:**
   - Select and connect your wallet
   - Click **"Verify Wallet Ownership"** — your wallet will prompt you to sign the message `"I certify that I own this wallet for ChainDonate Tracker."` using CIP-30 `signData` (no ADA is spent)
3. **Step 2 — Campaign Details:**
   - Enter your campaign title, description, and ADA funding goal
   - Optionally upload a verification document (school permit, org charter, etc.)
   - Click **"Register Campaign"**

Your campaign will appear on the dashboard immediately with a **PENDING** status badge. Admin verification is required for the **VERIFIED** badge.

---

## Making a Donation

1. Click any campaign card on the dashboard
2. In the Campaign Detail modal, find the **"Make a donation"** panel
3. Optionally toggle **"Add 1 ADA to support the community platform treasury"** — this adds 1 ADA to the treasury address in the same atomic transaction as your donation
4. Select a preset amount (1, 2, 5, or 10 ADA) or enter a custom amount (minimum 1 ADA)
5. Review the **Invoice Summary** showing your donation, optional treasury fee, and total
6. Click **"Confirm donation"** and approve the transaction in your wallet extension
7. The app polls Blockfrost every 15 seconds until the transaction is confirmed on-chain (up to 5 minutes), then displays the transaction hash receipt and updates the donation stats live

> If the poll times out before confirmation, the transaction is marked failed and the donation is not counted.

---

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/poll-tx` | `POST` | Checks Blockfrost for a given `txHash` — returns `{ confirmed: boolean }` |
| `/api/transactions` | `GET` | Fetch transactions; optionally filter by `?campaignId=` |
| `/api/transactions` | `POST` | Insert a new pending transaction record |

---

## Project Structure

```
ChainDonate/
├── app/
│   ├── page.tsx                      # Main page — campaign state, wallet state, modal orchestration
│   ├── layout.tsx                    # Root layout
│   ├── globals.css                   # Global styles
│   └── api/
│       ├── poll-tx/route.ts          # Blockfrost tx confirmation check
│       └── transactions/route.ts     # Transaction CRUD API
├── components/
│   ├── wallet.tsx                    # Wallet connect/disconnect UI
│   ├── CampaignDashboard.tsx         # Campaign grid view
│   ├── CampaignModal.tsx             # Campaign detail modal (stats + donate + history)
│   ├── CampaignHero.tsx              # Campaign header card
│   ├── DonateButton.tsx              # ADA donation widget — handles single & treasury split txs, confirmation polling
│   ├── DonationStats.tsx             # Total raised, donor count, progress bar
│   ├── DonationHistory.tsx           # Confirmed transaction history with Realtime updates
│   ├── InvoiceCalculator.tsx         # Pre-signing breakdown of donation + treasury fee
│   ├── TreasuryToggle.tsx            # Toggle to opt into 1 ADA treasury contribution
│   ├── TreasuryWidget.tsx            # Live treasury balance from Blockfrost (30s refresh)
│   ├── ArchivedCampaign.tsx          # Completed campaign view with CardanoScan link
│   ├── RegisterFormModal.tsx         # 2-step campaign registration (signData + form)
│   ├── StatusBadge.tsx               # VERIFIED / PENDING badge
│   └── types.ts                      # Shared TypeScript interfaces
├── lib/
│   ├── transaction.ts                # MeshSDK tx builder — sendLovelace & sendMultipleRecipients
│   ├── pollTxConfirmation.ts         # On-chain confirmation polling loop (pending → confirmed/failed)
│   ├── supabase.ts                   # Supabase client
│   └── formatter.ts                  # timeAgoFrom, colorFromAddr, initialsFromAddress utilities
├── .env.local                        # Environment variables (not committed)
├── next.config.ts
└── package.json
```

---

## Transaction Lifecycle

```
User clicks "Confirm donation"
        │
        ▼
sendLovelace() or sendMultipleRecipients()   ← MeshSDK builds & submits tx
        │
        ▼
Insert { status: "pending" } into Supabase
        │
        ▼
pollTxConfirmation() — polls /api/poll-tx every 15s (max 20 attempts / ~5 min)
        │
   confirmed?
   ├── YES → update { status: "confirmed", confirmed_at: now() }
   │          DonationHistory re-fetches via Supabase Realtime
   └── NO  → update { status: "failed" }, show error in UI
```

Only rows with `status = "confirmed"` appear in the donation history and are counted in campaign stats.

---

## Network & Architecture Notes

- **No smart contracts.** Donations are plain ADA transfers (peer-to-peer lovelace sends) using MeshSDK's `MeshTxBuilder`.
- **All transactions target the Cardano Preview Testnet** via Blockfrost.
- **Campaign and transaction metadata** are stored off-chain in Supabase for fast querying and real-time UI updates.
- **Treasury split** happens in a single atomic transaction — both the campaign address and treasury address are declared as outputs in the same tx, so there is no double fee or separate step.
- **Confirmation polling** runs client-side via `/api/poll-tx`, which proxies to Blockfrost server-side (keeping the API key out of the browser).