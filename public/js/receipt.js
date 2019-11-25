import { web3, userContract, init } from './userContract';
import firebase from './firebase-init';
import 'firebase/firebase-firestore';

const db = firebase.firestore();
const { liff } = window;

const initApp = async () => {
  const carPlate = document.getElementById('car-plate').value;
  const buttonElement = document.getElementById('button-submit');
  buttonElement.disabled = true;
  buttonElement.innerText = 'กำลังดำเนินการ โปรดรอซักครู่...';
  const select = document.getElementsByClassName('select');
  const services = Array.from(select)
    .filter(el => el.value !== '')
    .map(el => el.name);
  const subServices = Array.from(select)
    .filter(el => el.value !== '')
    .map(el => el.value);
  const comment = document.getElementById('other-services').value;
  const _userContract = await userContract.deployed();
  const accounts = await web3.eth.getAccounts();
  const lineDetail = await liff.getProfile();
  const dealerId = await _userContract.getHash(lineDetail.userId);
  const searchParams = new URLSearchParams(window.location.search);
  const userId = await _userContract.getHash(searchParams.get('userId'));
  const dealerInfo = await _userContract.getDealerInfo(dealerId);
  const userInfo = await _userContract.getUserInfo(userId);
  const { firstName, lastName } = userInfo;
  const verified = await _userContract.isVerified(dealerId);
  if (verified) {
    const result = await _userContract.insertRecord(
      dealerId,
      userId,
      carPlate,
      services,
      subServices,
      comment,
      { from: accounts[0] }
    );

    if (result.receipt.status) {
      await db
        .collection('Records')
        .doc(searchParams.get('userId'))
        .collection('Entries')
        .add({
          dealerName: dealerInfo.dealerName,
          userName: `${firstName} ${lastName}`,
          carPlate,
          services,
          subServices,
          comment,
        });
      alert('การทำรายการสำเร็จ');
      liff.closeWindow();
    }
  }
};

window.addEventListener('DOMContentLoaded', async () => {
  await liff.init({ liffId: '1653520229-vA50WW0A' });
});

document.getElementById('receipt').addEventListener('submit', async e => {
  e.preventDefault();
  await init();
  initApp();
});
