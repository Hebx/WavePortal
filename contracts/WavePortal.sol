// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {

	uint256 totalWaves;
// ??
	event NewWave(address indexed from, uint256 timestamp, string message);

	struct Wave {
		address waver; // address of the user who waved
		string message; // message the user sent
		uint256 timestamp; //timestamp when the user waver
	}

// store an array of structs. This is what lets me hold all the waves anyone ever sends to me!
	Wave[] waves;


	constructor() {
		console.log("WavePortal Smart Contract");
	}

// the message our user send us from the frontend
	function wave(string memory _message) public {
		totalWaves += 1;
		console.log("%s waved w/ message %s", msg.sender, _message);
// store the wave data in the array
		waves.push(Wave(msg.sender, _message, block.timestamp));
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

