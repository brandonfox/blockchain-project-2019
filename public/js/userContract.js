/* eslint-disable import/no-mutable-exports */
import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';
import UserContract from '../../build/contracts/UserContract.json';

const line = require('@line/bot-sdk');
const contract = require('truffle-contract');

export let web3;
export let userContract;

export const DealerClient = new line.Client({
  channelAccessToken:
    'zCyEDn4jZWQ5n7CPdK8lIy0leAQoE5QF3/uY53ND6hQP4C45g9royk/A8r7/p4PhJ9CKEjVgICZ0m7yH8RbX0is5UfMeogWS/Gxhfn3Q7U9Ry9/z8IWeEHjvHmeoSJjXEC/AmfcLUFYpaF0Ecdn5QgdB04t89/1O/w1cDnyilFU=',
});

export const UserClient = new line.Client({
  channelAccessToken:
    'hwM3ymw21vj2lhcWZhjvxWtN3XizPUctMfdh1tx8RrY5yhL5AYZMLR3dfNBa2RyFIEWmyxToyGXoOoEUwEcaNBjZZvD2eemiFYIcLCRCmRb9ERVhAWa1Olpydc4PGXstmwYBRYUSOOaroHX8VpTTVAdB04t89/1O/w1cDnyilFU=',
});

const initContract = async () => {
  userContract = contract(UserContract);
};

const initWeb3 = async () => {
  const provider = new HDWalletProvider(
    'device kid mountain library glimpse night coast agree coral exercise tuna coach',
    'https://rinkeby.infura.io/v3/6866ab47e3904ee18ddc89b3dee5cb0d'
  );
  web3 = new Web3(provider);
  userContract.setProvider(provider);
};

export const init = async () => {
  await initContract();
  await initWeb3();
};
