import React , {useEffect, useState, useCallback} from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json"

const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");
  // all state props to store all waves from your contract
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0x42ca26f9D1691a1c57eDcAB9e0c07D7cba571d78";
  const contractABI = abi.abi;

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        // call getAllWaves from our smart contract
        const waves = await wavePortalContract.getAllWaves();
        // We only need address, timestamp, and message in our UI ,
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });
        // store data in react state
        setAllWaves(wavesCleaned);
      } else {
        console.log("ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkIfWalletIsConnected = useCallback(async () => {
    // We make sure we have access to window.ethereum
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have Metamask!");
        return;
      } else {
        console.log("we have the ethereum object", ethereum);
      }

      // Check if we are authorized to access user's wallet
      const accounts = await ethereum.request({ method: 'eth_accounts'});
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an Authorized Account", account);
        setCurrentAccount(account);
        getAllWaves();
      } else {
        console.log("No Authorized Account!");
      }
    } catch (error) {
      console.log(error);
    }
}, [getAllWaves]);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get Metamask!");
        return;
      }
      const accounts = await ethereum.request({ method: 'eth_requestAccounts'});
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  // Call the function getTotalWaves from our smart contract to our Website

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Total Wave Count retrieved...", count.toNumber());

        // Execute the actual wave from our Smart Contract

        const waveAction = await wavePortalContract.wave("Hello!");
        console.log("Mining...", waveAction.hash);

        await waveAction.wait();
        console.log("Mined -- ", waveAction.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Total Waves Count Retrieved...", count.toNumber());
      } else {
        console.log("ethereum object is not available!");
      }
    } catch (error) {
      console.log(error);
    }
  }

// run our function when the page loads
useEffect(() => {
  checkIfWalletIsConnected();
}, [])

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        Hey I am Heb, Web 3 is Hype, Wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
        {/* if there is no currentAccount, render this button */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
          Connect Wallet
        </button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
              </div>)
        })}
      </div>
    </div>
  );
}
export default App;
