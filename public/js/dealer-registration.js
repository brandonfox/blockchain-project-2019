import firebase from './firebase-init';
import 'firebase/firebase-firestore';
import { web3, userContract, init } from './userContract';

const db = firebase.firestore();
const APPLICATION_REF = db.collection('Applications');
const { liff } = window;

const initApp = async () => {
  const buttonElement = document.getElementById('button-submit');
  buttonElement.disabled = true;
  buttonElement.innerText = 'กำลังดำเนินการ โปรดรอซักครู่...';
  const companyName = document.getElementById('company-name').value;
  const firstName = document.getElementById('first-name').value;
  const lastName = document.getElementById('last-name').value;
  const address = document.getElementById('address').value;
  const phoneNumber = document.getElementById('phone-number').value;
  const bestSeller = document.getElementById('best-seller').value;
  const promotion = document.getElementById('promotion').value;
  const otherServices = document.getElementById('other-services').value;
  const location = getCurrentCoordinates();

  const _userContract = await userContract.deployed();
  const accounts = await web3.eth.getAccounts();
  const lineDetail = await liff.getProfile();
  const dealerId = await _userContract.getHash(lineDetail.userId);
  const dealerInfo = {
    dealerName: companyName,
    firstName,
    lastName,
    addr: address,
    location: [ location.lat(), location.lng() ],
    phoneNo: phoneNumber,
    bestSeller,
    promotion,
    otherServices,
    availableServices: [],
    availableSubServices: [],
  };
  const result = await _userContract.createDealerApplication(
    dealerInfo,
    dealerId,
    {
      from: accounts[0],
    }
  );

  if (result.receipt.status) {
    await APPLICATION_REF.doc(lineDetail.userId).set({
      ...dealerInfo,
      verified: false,
    });
    alert('ขอบคุณสำหรับการลงทะเบียน');
    liff.closeWindow();
  }
};
async function fetchApplicationData() {
  const companyName = document.getElementById('company-name');
  const firstName = document.getElementById('first-name');
  const lastName = document.getElementById('last-name');
  const address = document.getElementById('address');
  const phoneNumber = document.getElementById('phone-number');
  const bestSeller = document.getElementById('best-seller');
  const promotion = document.getElementById('promotion');
  const otherServices = document.getElementById('other-services');
  const lineDetail = await liff.getProfile();
  const dealerInfo = await APPLICATION_REF.doc(lineDetail.userId).get();
  if (dealerInfo.exists) {
    companyName.value = dealerInfo.data().dealerName;
    firstName.value = dealerInfo.data().firstName;
    lastName.value = dealerInfo.data().lastName;
    address.value = dealerInfo.data().addr;
    phoneNumber.value = dealerInfo.data().phoneNo;
    bestSeller.value = dealerInfo.data().bestSeller;
    promotion.value = dealerInfo.data().promotion;
    otherServices.value = dealerInfo.data().otherServices;
    setLocation(dealerInfo.data().location);
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
  await liff.init({ liffId: '1653520229-GRByEEyo' });
  const lineDetail = await liff.getProfile();
  const doc = await APPLICATION_REF.doc(lineDetail.userId).get();
  if (doc.exists) {
    const data = doc.data();
    const { verified } = data;
    if (verified) {
      liff.openWindow({
        url: 'https://liff.line.me/1653520229-eDJywwyq',
      });
      return;
    }
  }
  await init();
  const _userContract = await userContract.deployed();
  // const hash = await _userContract.getHash("test")
  const hash = await _userContract.getHash(lineDetail.userId);
  const isVerifiedOnChain = await _userContract.isVerified(hash);
  if (isVerifiedOnChain) {
    liff.openWindow({
      url: 'https://liff.line.me/1653520229-eDJywwyq',
    });
    return;
  }
  await fetchApplicationData();
  document.querySelector('.pageloader').classList.remove('is-active');
});

document
  .getElementById('dealer-registration')
  .addEventListener('submit', async e => {
    e.preventDefault();
    initApp();
  });
