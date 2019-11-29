import { web3, userContract, init } from './userContract';

async function initApp() {
  const userContractInstance = await userContract.deployed();
  const accounts = await web3.eth.getAccounts();
}

document.addEventListener('DomContentLoaded', async () => {
  await init();
  initApp();
});
