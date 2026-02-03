# Spout Finance - Codebase Guide

## Overview

**Spout Finance** is a Web3 decentralized application (dApp) for tokenized real-world assets (RWA). It allows users to trade tokenized versions of stocks, bonds, and ETFs on-chain using ERC-3643 compliant security tokens. The platform runs on **Base Sepolia** (testnet) and **Pharos Testnet**, with plans for mainnet deployment.

- **Live URL**: https://spout.finance (landing) / https://app.spout.finance (dashboard)
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Blockchain**: EVM-compatible (Base Sepolia chain ID `84532`, Pharos chain ID `688688`)
- **Token Standard**: ERC-3643 (security tokens with identity/compliance layer)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Bundler | Turbopack (Next.js 16 default) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 + CSS variables (shadcn/ui theming) |
| UI Components | shadcn/ui (Radix primitives) + custom components |
| Wallet Connection | RainbowKit + wagmi v2 + viem |
| State Management | React Context + TanStack React Query |
| Authentication | Supabase Auth (email/password) |
| Database | Supabase (PostgreSQL) |
| Market Data API | Alpaca Markets API |
| Charts | Recharts + Lightweight Charts (TradingView) |
| Forms | React Hook Form + Zod validation |
| Animations | Framer Motion + Lenis (smooth scroll) |
| Notifications | Sonner + React Toastify |
| Monitoring | AWS CloudWatch RUM |
| Deployment | EC2 (standalone output) with nginx/CloudFront |
| Package Manager | bun (preferred), npm compatible |

---

## Project Structure

```
app/                          # Root of the project
├── abi/                      # Smart contract ABIs (JSON)
│   ├── cdpvault.json         # CDP vault system
│   ├── confidentailorders.json # Confidential orders (FHE/privacy)
│   ├── erc20.json            # Standard ERC-20
│   ├── erc3643.json          # ERC-3643 security token standard
│   ├── gateway.json          # Identity gateway
│   ├── gem.json              # Collateral token (MakerDAO-style)
│   ├── gemjoin.json          # Collateral adapter
│   ├── identity.json         # OnchainID identity contract
│   ├── identityregistry.json # Identity registry
│   ├── idfactory.json        # Identity factory
│   ├── onchainid.json        # OnchainID implementation
│   ├── ordersBlocksense.json # Orders using Blocksense oracle
│   ├── ordersChainlink.json  # Orders using Chainlink oracle
│   ├── proof-of-reserve.json # Proof of reserve verification
│   ├── spotter.json          # Price oracle (MakerDAO-style)
│   ├── stablecoinjoin.json   # Stablecoin adapter
│   ├── token.json            # Generic token ABI
│   └── vat.json              # Core accounting (MakerDAO-style)
│
├── app/                      # Next.js App Router pages
│   ├── layout.tsx            # Root layout (fonts, providers, navbar, footer)
│   ├── page.tsx              # Landing page (spout.finance)
│   ├── globals.css           # Global styles + Tailwind + CSS variables
│   ├── not-found.tsx         # Custom 404 page
│   │
│   ├── api/                  # API Routes (server-side)
│   │   ├── kyc-signature/route.ts    # Proxies KYC signing to backend
│   │   ├── mailing-list/route.ts     # Adds emails to Google Sheet
│   │   ├── marketdata/route.ts       # Fetches stock quotes from Alpaca
│   │   ├── marketdata/yields/route.ts # Fetches dividend yield data
│   │   ├── stocks/[ticker]/route.ts  # Single stock data endpoint
│   │   └── stocks/batch/route.ts     # Batch stock data endpoint
│   │
│   ├── app/                  # Dashboard (app.spout.finance)
│   │   ├── layout.tsx        # Dashboard layout (sidebar + header)
│   │   ├── page.tsx          # Dashboard home (portfolio overview)
│   │   ├── borrow/page.tsx   # Borrow page (CDP vault system)
│   │   ├── earn/page.tsx     # Earn/staking page
│   │   ├── markets/          # Markets section
│   │   │   ├── page.tsx      # Markets listing
│   │   │   └── [ticker]/page.tsx  # Individual stock detail
│   │   ├── portfolio/page.tsx     # Portfolio management
│   │   ├── profile/page.tsx       # User profile + KYC
│   │   ├── proof-of-reserve/page.tsx # Reserve transparency
│   │   └── trade/
│   │       ├── page.tsx           # Trade execution (buy/sell)
│   │       └── equities/page.tsx  # Equity selection screen
│   │
│   ├── auth/                 # Authentication pages
│   │   ├── layout.tsx        # Centered auth layout
│   │   ├── login/page.tsx    # Login form
│   │   ├── register/page.tsx # Registration form
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   │
│   ├── company/page.tsx      # About/company page
│   ├── faq/page.tsx          # FAQ page
│   └── markets/              # Public markets page (landing site)
│       ├── layout.tsx
│       └── page.tsx
│
├── aws/
│   └── rum-init.tsx          # AWS CloudWatch RUM initialization
│
├── components/               # All React components
│   ├── ui/                   # shadcn/ui base components (25 components)
│   │   ├── accordion.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── chart.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── progress.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx
│   │   ├── skeleton.tsx
│   │   ├── slider.tsx
│   │   ├── sonner.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── tooltip.tsx
│   │   ├── transaction-modal.tsx  # Custom transaction status modal
│   │   ├── pixel-trail.tsx        # Visual effect component
│   │   └── resizable-navbar.tsx   # Animated navbar
│   │
│   ├── features/             # Feature-specific components
│   │   ├── root/             # Landing page sections
│   │   │   ├── hero-section.tsx
│   │   │   ├── how-spout-works.tsx
│   │   │   ├── investment-different.tsx
│   │   │   ├── proof-of-reserve-landing.tsx
│   │   │   ├── transparent-reserves-section.tsx
│   │   │   ├── call-to-action-section.tsx
│   │   │   ├── faq-section.tsx
│   │   │   ├── partner-ticker.tsx
│   │   │   ├── join-mailing-list.tsx
│   │   │   ├── landing-content.tsx    # Orchestrates all landing sections
│   │   │   └── index.ts              # Barrel export
│   │   │
│   │   ├── trade/            # Trading components
│   │   │   ├── tradechart.tsx         # Price chart (Lightweight Charts)
│   │   │   ├── tradeform.tsx          # Buy/sell form
│   │   │   ├── tradeheader.tsx        # Trade page header
│   │   │   ├── tradetokenselector.tsx # Token dropdown
│   │   │   └── tradeequitysearch.tsx  # Equity search bar
│   │   │
│   │   ├── markets/          # Markets components
│   │   │   ├── markets-page.tsx
│   │   │   ├── market-header.tsx
│   │   │   ├── market-search.tsx
│   │   │   ├── market-stats.tsx
│   │   │   ├── stockcard.tsx
│   │   │   ├── stockgrid.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── portfolio/        # Portfolio components
│   │   │   ├── portfolioheader.tsx
│   │   │   ├── portfolioholdings.tsx
│   │   │   ├── portfolioperformance.tsx
│   │   │   ├── portfoliosummarycards.tsx
│   │   │   ├── portfolioactivity.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── profile/          # Profile components
│   │   │   ├── profileheader.tsx
│   │   │   ├── profiletabs.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── reserve/          # Proof of Reserve components
│   │   │   ├── reserve-header.tsx
│   │   │   ├── reserve-overview.tsx
│   │   │   ├── reserve-summary.tsx
│   │   │   ├── reserve-verification.tsx
│   │   │   ├── corporate-bonds.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── borrow/           # CDP/Borrow components
│   │   │   ├── vaultdeposit.tsx
│   │   │   ├── vaultpositions.tsx
│   │   │   ├── staking-apy-chart.tsx
│   │   │   ├── equitysearch.tsx
│   │   │   └── defi-dapp-store.tsx
│   │   │
│   │   ├── about/
│   │   │   └── about-page.tsx
│   │   │
│   │   └── faq/
│   │       └── faq-page.tsx
│   │
│   ├── contract/
│   │   └── OnchainIDChecker.tsx  # Checks if user has deployed an OnchainID
│   │
│   ├── interfaces/
│   │   └── Swapinterface.tsx     # Token swap UI
│   │
│   ├── icons/icons.tsx           # Custom SVG icons
│   ├── conditionalNavbar.tsx     # Shows/hides navbar based on route
│   ├── dashboardNavClient.tsx    # Dashboard sidebar + header
│   ├── footer.tsx                # Site footer
│   ├── kycFlow.tsx               # KYC onboarding wizard
│   ├── loadingSpinner.tsx        # Loading indicator
│   ├── navBar.tsx                # Main navigation bar
│   ├── providers.tsx             # All context providers (wagmi, RainbowKit, auth, network)
│   ├── signInForm.tsx            # Login form component
│   ├── signup.tsx                # Registration form component
│   ├── announcement-bar-wrapper.tsx
│   ├── bg-grain-svg.tsx          # Background texture
│   ├── magicui/marquee.tsx       # Scrolling text component
│   └── reserveproofpage.tsx
│
├── context/                  # React Context providers
│   ├── AuthContext.tsx        # Supabase auth state (user + profile)
│   ├── NetworkContext.tsx     # Chain/network state + auto-switch to Base Sepolia
│   └── userContext.tsx        # Additional user context
│
├── hooks/                    # Custom React hooks
│   ├── api/                  # Data-fetching hooks
│   │   ├── useAssetPrice.ts       # Generic asset price (any ticker)
│   │   ├── useLQDPrice.ts         # LQD-specific price data
│   │   ├── useMarketData.ts       # Market data from Alpaca API
│   │   ├── useMarketStocks.ts     # Batch stock data
│   │   ├── useReturns.ts          # Return calculations
│   │   └── useYieldData.ts        # Dividend yield data
│   │
│   ├── auth/                 # Auth hooks
│   │   ├── useAuth.ts             # Supabase session management
│   │   └── useCurrentUser.tsx     # Current user state
│   │
│   ├── view/onChain/         # Read-only blockchain hooks
│   │   ├── useCollateralTokenBalance.ts
│   │   ├── useIdentityContract.ts
│   │   ├── useIdentityVerification.ts
│   │   ├── useOnchainID.ts
│   │   ├── useRecentActivity.ts
│   │   ├── useReserveContract.ts
│   │   ├── useTokenBalance.ts
│   │   ├── useTotalSupply.ts
│   │   └── useUSDCTokenBalance.ts
│   │
│   ├── writes/onChain/       # Write (transaction) hooks
│   │   ├── useAddClaim.ts         # Add KYC claim to identity
│   │   ├── useERC20Approve.ts     # ERC-20 token approval
│   │   ├── useOrders.ts           # Buy/sell orders (Chainlink)
│   │   ├── useOrdersConfidential.ts # Confidential orders
│   │   └── useVault.ts            # CDP vault operations
│   │
│   ├── use-debounced-dimensions.tsx
│   ├── use-mobile.tsx             # Mobile breakpoint detection
│   ├── use-network-switch.tsx     # Network switching logic
│   ├── use-screen-size.tsx        # Screen size detection
│   └── useConfidentialOrdersContract.ts
│
├── lib/                      # Shared utilities and configuration
│   ├── addresses.ts          # Smart contract addresses (per chain)
│   ├── debug.ts              # Debug utilities
│   ├── getUser.ts            # User data fetching
│   ├── utils.ts              # cn(), subdomain helpers, country codes
│   │
│   ├── cache/                # Client-side caching utilities
│   ├── chainconfigs/         # Chain definitions
│   │   ├── base.ts           # Base Sepolia config (re-exports wagmi chain)
│   │   └── pharos.ts         # Pharos testnet config (custom chain)
│   ├── services/
│   │   └── marketData.ts     # Market data service layer
│   ├── supabase/
│   │   ├── supabase.ts       # Supabase client initialization
│   │   └── auth.ts           # Auth helper functions
│   ├── types/
│   │   ├── assets.ts         # Asset registry (14 tokens: LQD, AAPL, TSLA, etc.)
│   │   └── markets.ts        # Market/stock data types
│   └── utils/
│       ├── fetchWithTimeout.ts # fetch() wrapper with timeout support
│       └── formatters.ts      # Number/currency formatters
│
├── public/                   # Static assets (images, SVGs, partner logos)
├── style/                    # Additional style files
│
├── .env.example              # Environment variable template
├── components.json           # shadcn/ui configuration
├── next.config.js            # Next.js config (standalone, turbopack, caching)
├── package.json              # Dependencies and scripts
├── postcss.config.js         # PostCSS config
├── proxy.ts                  # Subdomain rewrite logic (app.spout.finance -> /app)
├── tailwind.config.ts        # Tailwind config (custom colors, fonts, animations)
├── tsconfig.json             # TypeScript config (strict, path aliases)
└── warp.json                 # Warp deployment config
```

---

## Architecture & Key Concepts

### Dual-Domain Architecture

The app serves two distinct experiences from the same codebase:

1. **`spout.finance`** (main domain) - Marketing/landing pages
   - Routes: `/`, `/faq`, `/company`, `/markets`
   - Shows public navbar + footer

2. **`app.spout.finance`** (subdomain) - Dashboard/dApp
   - Routes: `/app/*` (trade, portfolio, markets, borrow, profile, etc.)
   - Shows sidebar navigation + dashboard header
   - Requires wallet connection

The `proxy.ts` file handles rewriting requests from `app.spout.finance/trade` to the internal `/app/trade` route. The `conditionalNavbar.tsx` component shows/hides the appropriate navigation based on the current path.

### Smart Contract System

The project uses a **MakerDAO-inspired CDP (Collateralized Debt Position) system** combined with ERC-3643 security tokens:

| Contract | Purpose |
|---|---|
| **Vat** | Core accounting engine (tracks collateral and debt) |
| **GemJoin** | Adapter for depositing collateral tokens |
| **StablecoinJoin** | Adapter for minting/burning stablecoins (SPUS) |
| **Spotter** | Oracle interface for price feeds |
| **Orders (Chainlink)** | Buy/sell order execution using Chainlink oracles |
| **Orders (Blocksense)** | Alternative oracle provider |
| **Gateway** | Identity gateway for KYC compliance |
| **IDFactory** | Factory for deploying OnchainID identity contracts |
| **IdentityRegistry** | Registry of verified identities |
| **ERC-3643 Token** | Security token with transfer restrictions (compliance) |
| **Proof of Reserve** | On-chain reserve verification |

Contract addresses for both chains are in `lib/addresses.ts`.

### KYC / Identity Flow (ERC-3643 Compliance)

ERC-3643 tokens require identity verification before trading. The flow is:

1. User connects wallet
2. `OnchainIDChecker` component checks if user has an OnchainID deployed
3. If not, the KYC flow (`kycFlow.tsx`) guides them through:
   - Deploying an OnchainID contract
   - Submitting KYC data (name, country, etc.)
   - Getting a signed claim from the backend (`/api/kyc-signature`)
   - Adding the claim to their OnchainID on-chain
4. Once verified, the user can trade ERC-3643 tokens

### Trading Flow

1. User selects an asset from the equity search screen (`/app/trade/equities`)
2. Redirected to `/app/trade?ticker=AAPL` (or whatever ticker)
3. The trade page loads:
   - Price chart from Alpaca API (via internal API routes)
   - Buy/sell form with real-time price quotes
4. **Buy flow**: Approve USDC -> Execute buy order (Chainlink oracle fetches price -> tokens minted)
5. **Sell flow**: Execute sell order (tokens burned -> USDC returned)
6. Transaction modal shows progress (waiting -> completed/failed)

### Asset Registry

All tradeable assets are defined in `lib/types/assets.ts`. Currently 14 assets:

- **LQD** - iShares Investment Grade Corporate Bond ETF (the primary/flagship asset)
- **AAPL**, **AMZN**, **GOOGL**, **META**, **MSFT**, **TSLA** - Big tech
- **COIN**, **HOOD** - Crypto/fintech
- **JPM** - Traditional finance
- **MSTR**, **BTBT** - Bitcoin-adjacent
- **AMBR**, **CRCL** - Crypto companies

Only **LQD** has deployed token contracts. The rest have placeholder (`0x000...`) addresses marked with `TODO`.

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_CHAIN_ID` | Yes | Target chain ID (`84532` for Base Sepolia) |
| `NEXT_PUBLIC_ALCHEMY_API_KEY` | Yes | Alchemy API key for RPC |
| `NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID` | Yes | WalletConnect project ID (from cloud.walletconnect.com) |
| `APCA_API_KEY_ID` | Yes | Alpaca Markets API key (for stock data) |
| `APCA_API_SECRET_KEY` | Yes | Alpaca Markets secret key |
| `ALPHA_VANTAGE_API_KEY` | No | Alpha Vantage API key (alternative data source) |
| `BACKEND_API_KEY` | Yes | API key for the KYC backend |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | No | For mailing list (Google Sheets) |
| `GOOGLE_PRIVATE_KEY` | No | For mailing list (Google Sheets) |
| `GOOGLE_SHEET_ID` | No | Google Sheet ID for mailing list |

---

## External Services & APIs

### Backend API
- **URL**: `https://rwa-deploy-backend-base-sepolia.onrender.com`
- **Purpose**: KYC signature generation (signs claims for OnchainID)
- **Auth**: `X-API-Key` header with `BACKEND_API_KEY`

### Alpaca Markets
- **URL**: `https://data.alpaca.markets/v2`
- **Purpose**: Real-time stock quotes, historical bars, corporate actions (dividends)
- **Auth**: `APCA-API-KEY-ID` + `APCA-API-SECRET-KEY` headers

### Supabase
- **Purpose**: User authentication (email/password) and profile storage
- **Tables**: `profiles` (user profiles linked to auth users)

### Google Sheets API
- **Purpose**: Mailing list signup (stores emails in a Google Sheet)
- **Auth**: Google service account JWT

### AWS CloudWatch RUM
- **Purpose**: Real user monitoring (performance, errors, HTTP metrics)
- **Config**: Only active when `NEXT_PUBLIC_AWS_RUM_APP_ID` is set

### Blockchain RPCs
- **Base Sepolia**: `https://base-sepolia.g.alchemy.com/v2/{key}` (hardcoded in providers.tsx)
- **Pharos Testnet**: `https://testnet.dplabs-internal.com`

---

## Provider Hierarchy

The app wraps all pages in a nested provider stack (see `components/providers.tsx`):

```
WagmiProvider (blockchain connection config)
  └── QueryClientProvider (TanStack React Query)
       └── RainbowKitProvider (wallet modal UI)
            └── AuthProvider (Supabase auth state)
                 └── NetworkProvider (auto-switch to Base Sepolia)
                      └── WalletConnectionPrompt (toast on /app routes)
                           └── {children}
```

---

## Available Scripts

```bash
bun dev          # Start dev server (Turbopack)
bun run build    # Production build (standalone output)
bun start        # Start production server
bun run lint     # ESLint
bun run format   # Prettier formatting
```

---

## API Routes Summary

| Method | Route | Description |
|---|---|---|
| POST | `/api/kyc-signature` | Proxies KYC claim signing to backend |
| POST | `/api/mailing-list` | Adds email to Google Sheet mailing list |
| GET | `/api/marketdata?symbol=LQD` | Fetches stock quote + yield from Alpaca |
| GET | `/api/marketdata/yields?symbol=LQD` | Fetches dividend yield data |
| GET | `/api/stocks/[ticker]` | Single stock data |
| GET | `/api/stocks/batch?symbols=AAPL,TSLA` | Batch stock data |

All API routes use `force-dynamic` (no caching) and have a 10-second max duration.

---

## Deployment

The app is configured for **self-hosted EC2 deployment**:

- `next.config.js` sets `output: "standalone"` for minimal Docker/EC2 builds
- Aggressive caching headers for static assets (1 year for SVGs/images)
- Security headers (X-DNS-Prefetch-Control, X-Content-Type-Options)
- `compress: true` for gzip compression
- `poweredByHeader: false` for security

The `warp.json` file suggests the project can also be deployed via Warp (Node.js 20.x).

---

## Key Design Patterns

1. **Barrel exports** - Feature folders use `index.ts` to re-export components cleanly
2. **Hook organization** - Hooks are split into `api/`, `auth/`, `view/onChain/`, and `writes/onChain/`
3. **Dynamic imports** - Heavy components (charts) are lazy-loaded with `next/dynamic`
4. **Subdomain routing** - Helper utilities (`getAppRoute`, `normalizePathname`) handle path differences between main domain and app subdomain
5. **Contract address resolution** - `useContractAddress(name)` hook resolves addresses per the connected chain ID
6. **Client-side caching** - `lib/cache/client-cache` provides caching for API responses

---

## Fonts

- **Public Sans** - Primary sans-serif (`--font-sans`)
- **IBM Plex Mono** - Monospace (`--font-mono`)
- **Lora** - Serif accent (`--font-lora`)
- **Noto Sans** - Secondary sans-serif (`--font-noto-sans`)

All loaded from Google Fonts with `display: "swap"` to prevent FOIT.

---

## Brand Colors

| Name | Value | Usage |
|---|---|---|
| `spout-primary` | `#004040` | Primary teal/dark green |
| `spout-accent` | `#A7C6ED` | Light blue accent |
| `spout-text-muted` | `#525252` | Muted text |
| `spout-text-secondary` | `#3D5678` | Secondary text |
| `spout-text-gray` | `#8C9BAA` | Gray text |
| `spout-border` | `#E5E5E5` | Border color |
