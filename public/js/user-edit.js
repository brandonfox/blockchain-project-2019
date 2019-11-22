import {web3, userContract, init} from './userContract';

const initApp = async () => {
  const firstName = document.getElementById('first-name').value;
  const lastName = document.getElementById('last-name').value;
  const adr = document.getElementById('address').value;
  const phNo = document.getElementById('phone-number').value;
  const email = document.getElementById('email').value;
  const brand = document.getElementById('car-manufacture').value;
  const model = document.getElementById('car-model').value;
  const _userContract = await userContract.deployed();
  const accounts = await web3.eth.getAccounts();
  const userId = await _userContract.getHash('user');
  await _userContract.editUserInfo(
    userId,
    {
      firstName,
      lastName,
      adr,
      phNo,
      email,
    },
    { from: accounts[0] }
  );
  await _userContract.editCarDetails(
    userId,
    'NA34 87',
    {
      brand,
      model,
      year: '1997',
    },
    { from: accounts[0] }
  );
  const infoReply = await _userContract.getUserInfo(userId);
  const carDetails = await _userContract.getCars(userId);
  console.log('infoReply', infoReply);
  console.log('carDetails', carDetails);
};

document.getElementById('user-edit').addEventListener('submit', async e => {
  e.preventDefault();
  await init();
  initApp();
});
