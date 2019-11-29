// import Web3 from "web3";
import Web3 from "web3";
const HDWalletProvider = require("@truffle/hdwallet-provider");
const contract = require("@truffle/contract");

const contractJson: JSON = require("../../resource/build/contracts/AppointmentHandler.json");
export let web3: any;
export const initWeb3 = async () => {
  const provider = new HDWalletProvider(
    "arrest zero problem hollow tongue scrub pet all parent love rubber cattle",
    "https://rinkeby.infura.io/v3/6866ab47e3904ee18ddc89b3dee5cb0d"
  );
  web3 = new Web3(provider);
  const initializedContract: any = contract(contractJson);
  initializedContract.setProvider(provider);
  return initializedContract.deployed();
};
