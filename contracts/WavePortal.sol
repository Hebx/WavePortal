// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";


contract WavePortal {
    uint256 totalWaves;
    // helpful generate a new seed and protect from sophisticated attacks
    uint256 private seed;

    // events are messages our smart contracts throw out that we can capture on our client in real-time.
    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver; // address of the user who waved
        string message; // message the user sent
        uint256 timestamp; //timestamp when the user waver
    }

     // This is an address => uint mapping, meaning I can associate an address with a number!
      // In this case, I'll be storing the address with the last time the user waved at us.
    mapping(address => uint256) public lastWavedAt;
    // store an array of structs. This is what lets me hold all the waves anyone ever sends to me!
    Wave[] waves;

    constructor() payable {
        console.log("WavePortal Smart Contract");
    // set the initial seed
    seed = (block.timestamp + block.difficulty) % 100;
    }

    // the message our user send us from the frontend
    function wave(string memory _message) public {

// We need to make sure the current timestamp is at least 30-seconds bigger than the last timestamp we stored
        require(
            lastWavedAt[msg.sender] + 30 seconds < block.timestamp,
            "Wait 15m"
        );
// update the current timestamp we have for the user
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log("%s waved w/ message %s", msg.sender, _message);
        // store the wave data in the array
        waves.push(Wave(msg.sender, _message, block.timestamp));

        // generate a new seed for the next user that sends a wave
        seed = (block.timestamp + block.difficulty) % 100;
        console.log("Random # generated %d", seed);

        // give 50% chance that the user win the prize
        if (seed <= 50) {
            console.log("%s Won", msg.sender);
        uint256 prizeAmount = 0.00001 ether;
        require(
            prizeAmount <= address(this).balance,
            "Trying to withdraw more money than the contract has"
        );
        (bool success, ) = (msg.sender).call{value: prizeAmount}("");
        require(success, "Failed to withdraw money from contract");
        }

        // ??
        emit NewWave(msg.sender, block.timestamp, _message);
    }

    // function getAllWaves returns struct array of waves
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}
