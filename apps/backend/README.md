# Weep Backend Documentation

Welcome to the Weep Backend documentation. This document is intended for frontend developers and other team members setting up or integrating with the Weep Protocol backend.

## Overview

The Weep Backend is an AI-native micro-tipping platform built on the Cronos blockchain. It facilitates payments using the x402 protocol and Thirdweb SDK.

- **Stack**: Node.js, Express, TypeScript
- **Blockchain**: Cronos (Mainnet/Testnet)
- **Payments**: USDC (6 decimals)
- **Database**: SQLite (Local development) / PostgreSQL (Production ready)

---

## Prerequisites

Before setting up the backend, ensure you have the following:

- **Node.js** (v18 or higher)
- **NPM** or **Yarn**
- **Thirdweb Account**: You'll need a [Thirdweb Secret Key](https://thirdweb.com/dashboard/settings/api-keys).
- **Wallet**: A server wallet address to act as a facilitator.

---

## Environment Variables

Create a `.env` file in `apps/backend/` based on the following template:

```env
PORT=3001
FRONTEND_URL=http://localhost:3000

# Blockchain Configuration
# 338 for Cronos Testnet, 25 for Cronos Mainnet
CHAIN_ID=338

# Thirdweb Configuration
THIRDWEB_SECRET_KEY=your_thirdweb_secret_key
SERVER_WALLET_ADDRESS=your_facilitator_wallet_address

# Database (Optional, defaults to SQLite)
# DATABASE_URL=postgresql://user:password@localhost:5432/weep
```

---

## Setup & Installation

1. **Install Dependencies**:
   ```bash
   cd apps/backend
   npm install
   ```

2. **Run in Development Mode**:
   ```bash
   npm run dev
   ```
   The server will start at `http://localhost:3001`.

3. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## Cronos & USDC Configuration

The backend supports Cronos Mainnet and Testnet. The configuration is automatically selected based on the `CHAIN_ID` environment variable.

| Network | Chain ID | USDC Address | Explorer |
| :--- | :--- | :--- | :--- |
| **Cronos Mainnet** | 25 | `0xc21223249CA28397B4B6541dfFaEcC539BfF0c59` | [Explorer](https://explorer.cronos.org/) |
| **Cronos Testnet** | 338 | `0x7C8cf427BB01246843bDED21B71BeF343a824712` | [Testnet Explorer](https://explorer.cronos.org/testnet) |

---

## API Documentation

The backend uses Swagger for API documentation. Once the server is running, you can access the interactive documentation at:

`http://localhost:3001/api/docs`

### Key API Endpoints

- **Merchants**: `/api/merchants` - Manage merchant profiles and stats.
- **Sessions**: `/api/sessions` - Create and manage tip sessions.
- **Payments**: `/api/payments` - Prepare, verify, and settle payments.
- **Receipts**: `/api/receipts` - Retrieve digital receipts for transactions.

---

## Integration Guide for Frontend

### 1. Fetching Merchant Info
To display a tipping page, first fetch the merchant details:
`GET /api/merchants/:slug_or_id`

### 2. Creating a Tip Session
When a user starts a tipping flow:
`POST /api/sessions` with `{ merchantId, billAmount }`

### 3. Payment Flow
The backend uses a three-step payment process:
1. **Prepare**: `POST /api/payments/prepare` (returns payment requirements).
2. **Verify**: `POST /api/payments/verify` (optional client-side check).
3. **Settle**: `POST /api/payments/settle` (finalizes transaction on-chain).

### 4. Cronos Setup
Ensure the frontend is configured to use the same `CHAIN_ID` as the backend. Use Thirdweb's `Cronos` or `CronosTestnet` chain objects.
