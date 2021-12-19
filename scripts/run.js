const main = async () => {
	const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
	const waveContract = await waveContractFactory.deploy({
		// go and deploy my contract and fund it with 0.1 ETH
		value: hre.ethers.utils.parseEther('0.1'),
	});
	await waveContract.deployed();
	console.log("Contract Address:", waveContract.address);

	// Get contract Balance
	let contractBalance = await hre.ethers.provider.getBalance(
		waveContract.address
	);
	console.log("Contract balance:", hre.ethers.utils.formatEther(contractBalance));

	let waveCount;
	waveCount = await waveContract.getTotalWaves();
	console.log(waveCount.toNumber());
	// console.log("Contract Deployed by owner:", owner.address);
	// console.log("Contract Deployed by randomPerson", randomPerson.address);

	//sending few waves
	let waveAction1 = await waveContract.wave('Hello World1!');
	await waveAction1.wait(); // Wait for the transaction to be mined
	const [_, randomPerson] = await hre.ethers.getSigners();
	let waveAction2 = await waveContract.wave('Hello World2!');
	await waveAction2.wait();
	waveAction1 = await waveContract.connect(randomPerson).wave('Hey Metaverse1!');
	await waveAction1.wait(); // Wait for the transaction to be mined
	waveAction2 = await waveContract.connect(randomPerson).wave('Hey Metaverse2!');
	await waveAction2.wait(); // Wait for the transaction to be mined

	// get contract balance to see what happened
	contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
	console.log("Contract balance:", hre.ethers.utils.formatEther(contractBalance));

	let allWaves = await waveContract.getAllWaves();
	console.log(allWaves);
	// waveCount = await waveContract.getTotalWaves();
	// waveCount = await waveContract.getTotalWaves();

};

const runMain = async () => {
	try {
		await main();
		process.exit(0);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

runMain();
