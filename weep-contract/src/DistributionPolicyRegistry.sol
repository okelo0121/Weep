// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

//ERRORS
error InvalidPercentages();
error NotPolicyManager();
error PolicyInactive();
error NothingToClaim();

// POLICY REGISTRY
contract DistributionPolicyRegistry {
    struct Policy {
        address manager;
        address[] recipients; // employee wallets
        uint256[] percentages; // basis points (10000 = 100%)
        bool active;
        uint256 createdAt;
    }

    uint256 public policyCount;
    mapping(uint256 => Policy) public policies;

    event PolicyCreated(uint256 indexed policyId, address indexed manager);
    event PolicyDeactivated(uint256 indexed policyId);

    function createPolicy(
        address[] calldata recipients,
        uint256[] calldata percentages
    ) external returns (uint256 policyId) {
        if (recipients.length == 0 || recipients.length != percentages.length) {
        revert InvalidPercentages();
        }

        uint256 total;
        for (uint256 i; i < percentages.length; i++) {
        total += percentages[i];
        }
        if (total != 10_000) revert InvalidPercentages();

        policyId = ++policyCount;

        policies[policyId] = Policy({
        manager: msg.sender,
        recipients: recipients,
        percentages: percentages,
        active: true,
        createdAt: block.timestamp
        });

        emit PolicyCreated(policyId, msg.sender);
    }

    function deactivatePolicy(uint256 policyId) external {
        Policy storage policy = policies[policyId];
        if (msg.sender != policy.manager) revert NotPolicyManager();
        policy.active = false;
        emit PolicyDeactivated(policyId);
    }

    function getPolicy(uint256 policyId) external view returns (
        address manager,
        address[] memory recipients,
        uint256[] memory percentages,
        bool active
    )
    {
        Policy storage policy = policies[policyId];
        return (
            policy.manager,
            policy.recipients,
            policy.percentages,
            policy.active
        );
    }
}