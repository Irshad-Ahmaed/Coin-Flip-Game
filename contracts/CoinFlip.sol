// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CoinFlip {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function flipCoin(bool _guess) public payable returns (bool) {
        require(msg.value > 0.0, "You need to bet some ETH");
        bool result = (block.timestamp % 2 == 0);
        if (result == _guess) {
            payable(msg.sender).transfer(msg.value * 2);
            return true;
        } else {
            return false;
        }
    }

    // Function to withdraw funds from the contract
    function withdraw() public {
        require(msg.sender == owner, "Only the owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }

    // Fallback function to receive ETH
    receive() external payable {}
}