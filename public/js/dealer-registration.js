import { web3, userContract, init } from './userContract';

const initApp = async () => {
  const companyName = document.getElementById('company-name').value;
  const firstName = document.getElementById('first-name').value;
  const lastName = document.getElementById('last-name').value;
  const address = document.getElementById('address').value;
  const phoneNumber = document.getElementById('phone-number').value;
  const bestSeller = document.getElementById('best-seller').value;
  const promotion = document.getElementById('promotion').value;
  const otherServices = document.getElementById('other-services').value;

  const _userContract = await userContract.deployed();
  const accounts = await web3.eth.getAccounts();
  const lineDetail = await liff.getProfile();
  const dealerId = await _userContract.getHash(lineDetail.userId);
  const dealerInfo = {
    dealerName: companyName,
    firstName,
    lastName,
    addr: address,
    location: '192',
    phoneNo: phoneNumber,
    bestSeller,
    promotion,
    otherServices,
    availableServices: [],
    availableSubServices: [],
  };
  await _userContract.createDealerApplication(dealerInfo, dealerId, { from: accounts[0] });
  const application = await _userContract.getAllDealerApplications({ from: accounts[0] });
  const node = document.createElement('p');
  const textNode = document.createTextNode(`'application.includes(dealerId)' ${application.includes(dealerId)}`);
  node.appendChild(textNode);
  document.getElementById('container').appendChild(node);
}

window.addEventListener('DOMContentLoaded', async () => {
  await liff.init({ liffId: '1653520229-EMmQJJQe' });
});

document.getElementById('dealer-registration').addEventListener('submit', async e => {
  e.preventDefault();
  await init();
  initApp();
});
