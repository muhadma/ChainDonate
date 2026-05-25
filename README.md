# ChainDonate
 
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
| **Campaign Registration** | Two-step flow: (1) connect a Cardano wallet and cryptographically sign a message to prove ownership, then (2) fill in campaign title, description, and funding goal |
| **Real-Time Updates** | Campaign list and donation stats update live via Supabase Realtime subscriptions without a page refresh |
| **Anti-Dust Guard** | Enforces a 1 ADA minimum donation to prevent transactions from being rejected by Cardano's UTXO minimum-value protocol rules |
 
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
git clone [<your-repo-url>](https://github.com/muhadma/ChainDonate.git)
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
 
# Supabase — from your project's Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```
 
> **Important:** The `NEXT_PUBLIC_BLOCKFROST_PROJECT_ID` must start with `preview` — the app runs on the **Cardano Preview Testnet**, not mainnet.
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
create table transactions (
  id uuid default gen_random_uuid() primary key,
  tx_hash text not null unique,
  address text not null,        -- campaign's target_address (recipient)
  amount numeric not null,      -- in ADA (not lovelace)
  created_at timestamptz default now()
);
 
-- Enable Realtime for both tables
-- In the Supabase dashboard: Database → Replication → toggle on "campaigns" and "transactions"
```
 
Then enable **Row Level Security (RLS)** policies as needed, or disable RLS during development:
 
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
   - Click **"Verify Wallet Ownership"** — your wallet will prompt you to sign the message `"I certify that I own this wallet for ChainDonate Tracker."` (no ADA is spent)
3. **Step 2 — Campaign Details:**
   - Enter your campaign title, description, and ADA funding goal
   - Optionally upload a verification document (school permit, org charter, etc.)
   - Click **"Register Campaign"**
Your campaign will appear on the dashboard immediately with a **PENDING** status badge. Admin verification is required for the **VERIFIED** badge.
 
---
 
## Making a Donation
 
1. Click any campaign card on the dashboard
2. In the Campaign Detail modal, find the **"Make a donation"** panel
3. Select a preset amount (1, 2, 5, or 10 ADA) or enter a custom amount (minimum 1 ADA)
4. Click **"Confirm donation"**
5. Approve the transaction in your wallet extension
6. The transaction hash receipt will appear on success, and the donation stats update in real time
---
 
## Project Structure
 
```
ChainDonate/
├── app/
│   ├── page.tsx                  # Main page — campaign state, wallet state, modal orchestration
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   └── api/transactions/
│       └── route.ts              # API route for transaction queries
├── components/
│   ├── wallet.tsx                # Wallet connect/disconnect UI
│   ├── CampaignDashboard.tsx     # Campaign grid view
│   ├── CampaignModal.tsx         # Campaign detail modal (stats + donate + history)
│   ├── CampaignHero.tsx          # Campaign header card
│   ├── DonateButton.tsx          # ADA donation widget with preset amounts
│   ├── DonationStats.tsx         # Total raised, donor count, progress bar
│   ├── DonationHistory.tsx       # Transaction history for a campaign
│   ├── RegisterFormModal.tsx     # 2-step campaign registration modal
│   ├── StatusBadge.tsx           # VERIFIED / PENDING badge
│   └── types.ts                  # Shared TypeScript interfaces
├── lib/
│   ├── transaction.ts            # MeshSDK + Blockfrost ADA transfer logic
│   ├── supabase.ts               # Supabase client
│   └── formatter.ts              # Utility formatters
├── .env.local                    # Environment variables (not committed)
├── next.config.ts
└── package.json
```
 
---
 
## Network & Contract Notes
 
- This DApp uses **no smart contracts**. Donations are plain ADA transfers (peer-to-peer lovelace sends).
- All transactions are submitted to the **Cardano Preview Testnet** via Blockfrost.
- Campaign and transaction metadata are stored off-chain in Supabase for fast querying and real-time UI updates.
- The `treasury_enabled` flag on a campaign triggers a UI notice about a 1 ADA auto-treasury protection routine (front-end display only in the current version).

 
 
