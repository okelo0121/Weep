# Weep

AI-Native Micro-Tipping & Autonomous Payment Layer on Solana + x402-style Rails
Weep enables one-tap tipping, automated AI tipping, transparent distribution, and on-chain audit proofs for the global creator, hospitality, and service economy — built for both humans and AI agents.

## Background & Why Weep

Tipping is moving into a digital-first global economy. From restaurants and delivery drivers to streamers and digital workers, tipping is now a major part of income across industries.
Yet digital tipping is still fragmented, expensive, and opaque.
Legacy payment rails were not designed for micro-transactions or global service economies. Users do not trust that tips reach workers.
Workers lack visibility and transparency. Cross-border tipping remains difficult. Wallet UX across platforms is inconsistent.
And as AI agents emerge as economic participants, today’s systems cannot support autonomous tipping or programmable appreciation.
Tink exists to solve these gaps and create an internet-native tipping protocol.

## Overview

Weep is a protocol for frictionless, transparent, programmable tipping built on Solana and x402-style payment flows.
It enables users and AI agents to send appreciation in the form of fast, low-fee micro-payments triggered via QR codes, shareable links, or server-initiated pay-to-unlock flows.
Weep handles payment initiation, automatic suggested tips, transaction verification, transparent split logic, and audit-proof record anchoring.
Workers and creators can view tips instantly through a dashboard, while merchants gain access to transparent payout and export tools.
The protocol is designed to operate seamlessly across real-world venues and digital platforms and can be extended to autonomous agent environments, allowing AI systems to reward service and digital labor without human intervention.
Tink’s mission is to become the native tipping rail of the internet — where humans and intelligent agents can express appreciation instantly and verifiably.

## Key Features

| Feature                            | Description                                  |
| ---------------------------------- | -------------------------------------------- |
| One-click Tip Links & QR           | Scan or tap to tip instantly without login   |
| x402-style “Payment Required” flow | Web-native pay-to-unlock mechanism           |
| AI Tip Suggestions                 | Rule-based first, ML expansion later         |
| On-chain Audit Proofs              | Anchor digest on Solana for verifiable trail |
| Transparent Split Rules            | FOH/BOH or creator-team split; CSV export    |
| Merchant Dashboard                 | Real-time view, export, dispute log          |
| Wallet Support                     | Phantom, Phantom CASH, CDP Embedded Wallets  |
| Agent-Compatible                   | AI agent automatic tipping logic             |

## Protocol Flow

``` mermaid
sequenceDiagram
    autonumber

    participant User as User
    participant FE as Tink Frontend
    participant BE as Backend API
    participant Wallet as Wallet (Phantom/CDP)
    participant Chain as Solana Network
    participant DB as Database
    participant Worker as Worker Portal

    User ->> FE: Scan QR / Open Tip Link
    FE ->> BE: GET /api/resource (session)
    BE -->> FE: 402 Payment Required JSON<br/>amount, pay_to, memo, session

    User ->> FE: Select tip amount (AI suggestion or manual)
    User ->> Wallet: Approve and sign transaction
    Wallet ->> Chain: Broadcast transaction
    Chain -->> Wallet: Confirm transaction hash
    Wallet -->> FE: Return tx_hash

    FE ->> BE: POST /api/verify { session, tx_hash }
    BE ->> Chain: Verify tx details<br/>amount, receiver, confirmations
    Chain -->> BE: Validated transaction
    BE ->> DB: Store tip record (amount, tx_hash, merchant, user)
    BE ->> DB: Create distribution simulation record

    BE ->> Chain: Anchor digest (optional memo tx)
    Chain -->> BE: Anchor tx_hash

    BE -->> FE: Receipt info + proof links
    FE -->> User: Show receipt with tx hash + audit link

    DB -->> Worker: Tip appears in real-time dashboard
```

# User Flow

``` mermaid
sequenceDiagram
    autonumber

    participant User
    participant FE as Tink UI
    participant Wallet as Wallet App

    User ->> FE: Scan QR or open tip link
    FE -->> User: Load tip screen

    User ->> FE: View AI suggestion or manual input option
    FE ->> User: Show suggested and manual amounts

    alt Accept AI suggestion
        User ->> FE: Select suggested tip amount
    else Choose manually
        User ->> FE: Enter custom tip amount
    end

    User ->> Wallet: Connect wallet & approve payment
    Wallet ->> Wallet: Broadcast transaction

    alt Payment success
        Wallet -->> FE: Return tx success
        FE -->> User: Show receipt and proof info
        User ->> User: Done
    else Payment fails
        Wallet -->> FE: Return failure
        FE -->> User: Show retry or cancel
    end
```

# Weep Flow

``` mermaid
sequenceDiagram
    participant User
    participant TinkServer
    participant Blockchain

    User->>ServWeeper: 1. Scan QR / Request Tip Resource
    WeepServer-->>User: 2. HTTP 402 Payment Required (AI suggested tip)
    User->>Blockchain: 3. Send Payment via Wallet
    Blockchain-->>WeepServer: 4. Confirm Transaction
    WeepServer-->>User: 5. Verify + Return Receipt (on-chain proof, split info)
```


## Tech Stack

## MVP Scope

* One-click Tip Link / QR flow
* x402-style “Payment Required” request + verify
* On-chain memo digest anchoring
* Merchant dashboard with split rules and CSV export
* Demo: QR scan → wallet pay → dashboard shows verified tip

Stretch: AI suggestion engine and hybrid on/off-chain split automation.

## Roadmap

| Phase   | Features                            |
| ------- | ----------------------------------- |
| MVP     | Link/QR flow, dashboard, audit hash |
| Phase 2 | AI scoring, worker view, POS SDK    |
| Phase 3 | Auto split payouts, multi-token     |
| Phase 4 | Base + Coinbase wallet integration  |
| Phase 5 | Autonomous AI-to-AI tipping         |

## Conclusion
Weep is building an internet-native tipping layer powered by real-time micro-payments, transparent reward distribution, and autonomous agent support.
It transforms tipping into a programmable primitive — allowing both humans and AI agents to express appreciation instantly, fairly, and verifiably.


