// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TipDistributor {
    DistributionPolicyRegistry public immutable registry;

    uint256 public tipCount;

    struct Tip {
    address payer;
    uint256 amount;
    uint256 policyId;
    uint256 timestamp;
    }

    mapping(uint256 => Tip) public tips;
    mapping(address => uint256) public claimable; // pull-based model

    event TipReceived(
        uint256 indexed tipId,
        address indexed payer,
        uint256 amount,
        uint256 policyId
    );

    event TipAllocated(
        uint256 indexed tipId,
        address indexed employee,
        uint256 amount
    );

    event Claimed(address indexed employee, uint256 amount);

    constructor(address _registry) {
        registry = DistributionPolicyRegistry(_registry);
    }

    function createTip(uint256 policyId) external payable {
        if (msg.value == 0) revert();

        (
            ,
            address[] memory recipients,
            uint256[] memory percentages,
            bool active
        ) = registry.getPolicy(policyId);

        if (!active) revert PolicyInactive();

        uint256 tipId = ++tipCount;

        tips[tipId] = Tip({
            payer: msg.sender,
            amount: msg.value,
            policyId: policyId,
            timestamp: block.timestamp
        });

        // allocate funds (pull-based)
        for (uint256 i; i < recipients.length; i++) {
            uint256 share = (msg.value * percentages[i]) / 10_000;
            claimable[recipients[i]] += share;
            emit TipAllocated(tipId, recipients[i], share);
        }

        emit TipReceived(tipId, msg.sender, msg.value, policyId);
    }

    function claim() external {
        uint256 amount = claimable[msg.sender];
        if (amount == 0) revert NothingToClaim();

        claimable[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "ETH_TRANSFER_FAILED");

        emit Claimed(msg.sender, amount);
    }

    receive() external payable {}
}