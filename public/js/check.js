import { web3, userContract, init } from './userContract';

const initApp = async () => {
  const _userContract = await userContract.deployed();
  const accounts = await web3.eth.getAccounts();
  const application = await _userContract.getAllDealerApplications({ from: accounts[0] });
  const node = document.createElement('p');
  console.log('application', application);
  const textNode = document.createTextNode(`application, ${application}`);
  node.appendChild(textNode);
  document.getElementById('container').appendChild(node);
}

window.addEventListener('DOMContentLoaded', async () => {
  await init();
  initApp();
});