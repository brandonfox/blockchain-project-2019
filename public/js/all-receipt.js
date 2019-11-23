import { web3, userContract, init } from './userContract';

const initApp = async () => {
  const _userContract = await userContract.deployed();
  const accounts = await web3.eth.getAccounts();
};

window.addEventListener('DOMContentLoaded', async () => {
  await init();
  initApp();
});
