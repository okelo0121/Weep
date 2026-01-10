# WEEP – Trustless Tipping Infrastructure

**Core principles:**
* Managers define distribution rules
* Managers NEVER custody funds
* Employees receive tips directly in their wallets
* All allocations are publicly verifiable

## DEPLOYMENT NOTES (FOUNDRY)

* Deploy DistributionPolicyRegistry
* Deploy TipDistributor with registry address
* Manager creates a policy (FOH / BOH / Bar)
* Users tip via createTip(policyId)
* Employees claim directly from their wallets

**This contract intentionally avoids:**
* Custodial logic
* Payroll systems
* Tax enforcement
* Upgrade complexity

## FRONTEND NOTES (FOUNDRY)
**TipDistributor Deployed to 0xA9Eaf8E76966b60e9aB63C74a42605E84adF9EcE** (MAIN)
**DistributionPolicyRegistry Deployed to 0x81AeC0B87CAa631365B0AC0B628A84afdf6f1Fe9**

**Frontend writes to: TipDistributor**
**Frontend reads from:**
* TipDistributor (tips, claimable balances)
* DistributionPolicyRegistry (policy data – manager only)

* Tip flow
TipDistributor.createTip(policyId, { value: tipAmount })

* Employee earnings
TipDistributor.claimable(walletAddress)

* Withdraw tips
TipDistributor.claim()

* Manager Policy Setup (Admin Only)
registry.createPolicy(address[] recipients, uint256[] percentages)

* Example
await registry.createPolicy(
  [foh, boh, bar],
  [5000, 3000, 2000] // must sum to 10000
);

**Important Constraints**
* Percentages must sum to 10000
* createTip must send ETH
* Employees must claim themselves
* Managers cannot withdraw tips
* No custodial logic exists

