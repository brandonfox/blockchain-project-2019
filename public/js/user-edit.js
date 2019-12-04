import { web3, userContract, init } from './userContract';
import firebase from './firebase-init';
import 'firebase/firebase-firestore';

const db = firebase.firestore();
const { liff } = window;

const firstName = document.getElementById('first-name');
const lastName = document.getElementById('last-name');
const adr = document.getElementById('address');
const phNo = document.getElementById('phone-number');
const email = document.getElementById('email');
const brand = document.getElementById('car-manufacture');
const model = document.getElementById('car-model');

let lineDetail;

const initApp = async () => {
  const buttonElement = document.getElementById('button-submit');
  buttonElement.disabled = true;
  buttonElement.innerText = 'กำลังดำเนินการ โปรดรอซักครู่...';
  const _userContract = await userContract.deployed();
  const accounts = await web3.eth.getAccounts();
  const userId = await _userContract.getHash(lineDetail.userId);
  await _userContract.editUserInfo(
    userId,
    {
      firstName: firstName.value,
      lastName: lastName.value,
      adr: adr.value,
      phNo: phNo.value,
      email: email.value,
    },
    { from: accounts[0] }
  );
  const result = await _userContract.editCarDetails(
    userId,
    'NA34 87',
    {
      brand: brand.value,
      model: model.value,
      year: '1997',
    },
    { from: accounts[0] }
  );

  if (result.receipt.status) {
    await db
      .collection('UserSettings')
      .doc(lineDetail.userId)
      .set({
        generalProfile: {
          firstName: firstName.value,
          lastName: lastName.value,
          adr: adr.value,
          phNo: phNo.value,
          email: email.value,
        },
        carDetail: {
          brand: brand.value,
          model: model.value,
          year: '1997',
        },
      });
      await db.collection('UsersHashToIds').doc(userId).set({user_id: lineDetail.userId})
    alert('การทำรายการสำเร็จ');
    liff.closeWindow();
  }
};

async function fetchUserData() {
  const userData = await db
    .collection('UserSettings')
    .doc(lineDetail.userId)
    .get();
  if (userData.exists) {
    firstName.value = userData.data().generalProfile.firstName;
    lastName.value = userData.data().generalProfile.lastName;
    adr.value = userData.data().generalProfile.adr;
    phNo.value = userData.data().generalProfile.phNo;
    email.value = userData.data().generalProfile.email;
    brand.value = userData.data().carDetail.brand;
    model.value = userData.data().carDetail.model;
  }
}

document.body.addEventListener(
  'focus',
  event => {
    const { target } = event;
    switch (target.tagName) {
      case 'INPUT':
      case 'TEXTAREA':
      case 'SELECT':
        document.body.classList.add('keyboard');
        break;
      default:
    }
  },
  true
);
document.body.addEventListener(
  'blur',
  () => {
    document.body.classList.remove('keyboard');
  },
  true
);

window.addEventListener('DOMContentLoaded', async () => {
  await liff.init({ liffId: '1653518966-9P8gP0JY' });
  lineDetail = await liff.getProfile();
  await fetchUserData();
  document.querySelector('.pageloader').classList.remove('is-active');
});

document.getElementById('user-edit').addEventListener('submit', async e => {
  e.preventDefault();
  await init();
  initApp();
});
