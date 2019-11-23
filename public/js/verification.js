import { web3, userContract, init } from './userContract';

const initApp = async () => {
  const _userContract = await userContract.deployed();
  const accounts = await web3.eth.getAccounts();
  const application = await _userContract.getAllDealerApplications({ from: accounts[0] });
  console.log('application', application);
  const userInfo = await _userContract.getDealerInfo("0x4b80ed9b45be1f5eda5a49be86a2b59de0be90ec6593c2bb00be1634e60ddf12", { from: accounts[0] });
  console.log('userInfo', userInfo);
}

window.addEventListener('DOMContentLoaded', async () => {
  await init();
  initApp();
});