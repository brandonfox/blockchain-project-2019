import { web3, userContract, init } from './userContract';
import firebase from './firebase-init';
import 'firebase/firebase-firestore';

const db = firebase.firestore();

const initApp = async () => {
  const buttonElement = document.getElementById('button-submit');
  buttonElement.disabled = true;
  buttonElement.innerText = 'กำลังดำเนินการ โปรดรอซักครู่...';
  const firstName = document.getElementById('first-name').value;
  const lastName = document.getElementById('last-name').value;
  const adr = document.getElementById('address').value;
  const phNo = document.getElementById('phone-number').value;
  const email = document.getElementById('email').value;
  const brand = document.getElementById('car-manufacture').value;
  const model = document.getElementById('car-model').value;
  const _userContract = await userContract.deployed();
  const accounts = await web3.eth.getAccounts();
  const lineDetail = await liff.getProfile();
  const userId = await _userContract.getHash(lineDetail.userId);
  await _userContract.editUserInfo(
    userId,
    {
      firstName,
      lastName,
      adr,
      phNo,
      email
    },
    { from: accounts[0] }
  );
  const result = await _userContract.editCarDetails(
    userId,
    'NA34 87',
    {
      brand,
      model,
      year: '1997'
    },
    { from: accounts[0] }
  );

  if (result.receipt.status) {
    await db
      .collection('UserSettings')
      .doc(lineDetail.userId)
      .set({
        generalProfile: {
          firstName,
          lastName,
          adr,
          phNo,
          email
        },
        carDetail: {
          brand,
          model,
          year: '1997'
        }
      });
    alert('การทำรายการสำเร็จ');
    liff.closeWindow();
  }
};

window.addEventListener('DOMContentLoaded', async () => {
  await liff.init({ liffId: '1653518966-m50e4GyQ' });
});

document.getElementById('user-edit').addEventListener('submit', async e => {
  e.preventDefault();
  await init();
  initApp();
});
