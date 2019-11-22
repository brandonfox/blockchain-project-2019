import { web3, userContract, init } from './userContract';

const initApp = async () => {
  const select = document.getElementsByClassName('select');
  const services = Array.from(select).filter(el => el.value !== '').map(el => el.name);
  const subServices = Array.from(select).filter(el => el.value !== '').map(el => [el.value]);
  const comment = document.getElementById('other-services').value;
  const _userContract = await userContract.deployed();
  const accounts = await web3.eth.getAccounts();
  const dealerId = await _userContract.getHash('dealer');
  const userId = await _userContract.getHash('user');
  const testCarPlate = 'NA34 87';
  const verified = await _userContract.isVerified(dealerId);
  if (verified) {
    await _userContract.insertRecord(
      dealerId,
      userId,
      testCarPlate,
      services,
      subServices,
      comment, { from: accounts[0] }
    );
  }
  const records = await _userContract.getRecords(userId, testCarPlate, { from: accounts[0] });
  console.log('records', records)

};

document.getElementById('receipt').addEventListener('submit', async e => {
  e.preventDefault();
  await init();
  initApp();
});


