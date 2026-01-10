// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/DistributionPolicyRegistry.sol";
import "../src/TipDistributor.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();

        DistributionPolicyRegistry registry =
            new DistributionPolicyRegistry();

        TipDistributor distributor =
            new TipDistributor(address(registry));

        vm.stopBroadcast();

        console.log("Registry:", address(registry));
        console.log("Distributor:", address(distributor));
    }
}
