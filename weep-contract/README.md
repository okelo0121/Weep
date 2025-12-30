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