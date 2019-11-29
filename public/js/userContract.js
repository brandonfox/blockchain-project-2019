/* eslint-disable import/no-mutable-exports */
import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';
import NotificationHandler from '../../build/contracts/NotificationHandler.json';

const line = require('@line/bot-sdk');
const contract = require('truffle-contract');

export let web3;
export let userContract;

const initContract = async () => {
  userContract = contract(NotificationHandler);
};

const initWeb3 = async () => {
  const provider = new HDWalletProvider(
    'arrest zero problem hollow tongue scrub pet all parent love rubber cattle',
    'https://rinkeby.infura.io/v3/6866ab47e3904ee18ddc89b3dee5cb0d'
  );
  web3 = new Web3(provider);
  userContract.setProvider(provider);
};

export const init = async () => {
  await initContract();
  await initWeb3();
};
