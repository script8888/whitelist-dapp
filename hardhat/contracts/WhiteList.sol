//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Whitelist {
    // Max number of wl users
    uint8 public maxWl;

    //Mapping to keep track of address that have been wl-ed
    mapping(address => bool) public wlAddresses;
    // Total number of wl-ed address
    uint8 public numAddressesWhitelisted;

    // Set max whitelist at the time of deployment
    constructor(uint8 _maxWl) {
        maxWl = _maxWl;
    }

    function addAddressToWl() public {
        require(!wlAddresses[msg.sender], "You have already been whitelisted");
        require(numAddressesWhitelisted < maxWl, "Wl spots full");
        wlAddresses[msg.sender] = true;
        numAddressesWhitelisted += 1;
    }
}
