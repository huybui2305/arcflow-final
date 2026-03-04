# ArcFlow 🌐

> Cross-border Payments Dashboard — built natively on [Arc Network](https://arc.network)

**Live on Arc Testnet** · Sub-second USDC settlement · Fixed $0.001 fees · 148+ corridors

---

## Features (all real, on-chain)

| Feature | Implementation |
|---|---|
| 🔗 Connect Wallet | MetaMask / any EVM wallet, auto-adds Arc Testnet |
| 💵 Send USDC | Real ERC-20 transfer on Arc Testnet via `0x3600...` |
| 💶 Send EURC | Real ERC-20 transfer via `0x89B5...` |
| 📊 Live Block | Polling Arc RPC every 4s |
| 📜 TX History | Scans Transfer events from Arc RPC |
| ⚡ Confirm Time | Measured from submit → receipt (usually <1s) |
| 🔍 Explorer Links | Direct links to testnet.arcscan.app |

## Arc Network Config

```
RPC:      https://rpc.testnet.arc.network
Chain ID: 5042002
Explorer: https://testnet.arcscan.app
Faucet:   https://faucet.circle.com
```

## Contracts Used

```
USDC:  0x3600000000000000000000000000000000000000 (6 decimals, ERC-20)
EURC:  0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a (6 decimals)
```

## Deploy to Vercel

### Option 1 — GitHub + Vercel (recommended)

```bash
# 1. Push to GitHub
git init && git add . && git commit -m "feat: ArcFlow on Arc Network"
git remote add origin https://github.com/YOUR_USERNAME/arcflow.git
git push -u origin main

# 2. Go to vercel.com/new → Import repo → Deploy
# Vercel auto-detects Next.js. No config needed.
```

### Option 2 — Vercel CLI

```bash
npm install
npx vercel --prod
```

### Option 3 — Local dev

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Tech Stack

- **Next.js 14** (App Router)
- **ethers.js v6** — wallet connect + on-chain reads/writes
- **TypeScript** — type safety
- **Tailwind CSS** — utility styles

## Getting Testnet USDC

1. Go to [faucet.circle.com](https://faucet.circle.com)
2. Select **Arc Testnet** + **USDC**
3. Enter your wallet address → Receive USDC

---

Built for Arc Network ecosystem · Open source · MIT
