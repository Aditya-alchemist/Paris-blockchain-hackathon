// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.28;


import {Script} from "forge-std/Script.sol";
import {CarbonCreditNFT} from "../src/carboncredit.sol";

contract Deploy is Script{
    function run() external returns(CarbonCreditNFT){
        vm.startBroadcast();
        CarbonCreditNFT ccnft = new CarbonCreditNFT();
        vm.stopBroadcast();
        return ccnft;
    }
}