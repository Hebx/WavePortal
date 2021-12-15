const main = async () => {
	const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
	const waveContract = await waveContractFactory.deploy();
	await waveContract.deployed();
	console.log("Contract Address:", waveContract.address);

	let waveCount;
	waveCount = await waveContract.getTotalWaves();
	console.log(waveCount.toNumber());
	// console.log("Contract Deployed by owner:", owner.address);
	// console.log("Contract Deployed by randomPerson", randomPerson.address);

	//sending few waves
	let waveAction = await waveContract.wave('Hello World!');
	await waveAction.wait(); // Wait for the transaction to be mined
	const [_, randomPerson] = await hre.ethers.getSigners();
	waveAction = await waveContract.connect(randomPerson).wave('Hey Metaverse!');
	await waveAction.wait(); // Wait for the transaction to be mined

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
