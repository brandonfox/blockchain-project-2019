import { web3, userContract, init } from './userContract';
import firebase from './firebase-init';
import 'firebase/firebase-firestore';

const db = firebase.firestore();
const { liff } = window;

const companyName = document.getElementById('company-name');
const firstName = document.getElementById('first-name');
const lastName = document.getElementById('last-name');
const address = document.getElementById('address');
const phoneNumber = document.getElementById('phone-number');
const bestSeller = document.getElementById('best-seller');
const promotion = document.getElementById('promotion');
const otherServices = document.getElementById('other-services');
let lineDetail;

const initApp = async () => {
  const buttonElement = document.getElementById('button-submit');
  buttonElement.disabled = true;
  buttonElement.innerText = 'กำลังดำเนินการ โปรดรอซักครู่...';
  const _userContract = await userContract.deployed();
  const accounts = await web3.eth.getAccounts();
  const dealerId = await _userContract.getHash(lineDetail.userId);
  const dealerInfo = {
    dealerName: companyName.value,
    firstName: firstName.value,
    lastName: lastName.value,
    addr: address.value,
    location: '192',
    phoneNo: phoneNumber.value,
    bestSeller: bestSeller.value,
    promotion: promotion.value,
    otherServices: otherServices.value,
    availableServices: [],
    availableSubServices: [],
  };
  const result = await _userContract.editDealerInfo(dealerInfo, dealerId, {
    from: accounts[0],
  });
  if (result.receipt.status) {
    await db
      .collection('Dealers')
      .doc(lineDetail.userId)
      .set({
        dealerName: companyName.value,
        firstName: firstName.value,
        lastName: lastName.value,
        addr: address.value,
        location: '192',
        phoneNo: phoneNumber.value,
        bestSeller: bestSeller.value,
        promotion: promotion.value,
        otherServices: otherServices.value,
        availableServices: [],
        availableSubServices: [],
        verified: true,
      });
    alert('การทำรายการสำเร็จ');
    liff.closeWindow();
  }
};

async function fetchDealerData() {
  const dealerData = await db
    .collection('Dealers')
    .doc(lineDetail.userId)
    .get();
  if (dealerData.exists) {
    companyName.value = dealerData.data().dealerName;
    firstName.value = dealerData.data().firstName;
    lastName.value = dealerData.data().lastName;
    address.value = dealerData.data().addr;
    phoneNumber.value = dealerData.data().phoneNo;
    bestSeller.value = dealerData.data().bestSeller;
    promotion.value = dealerData.data().promotion;
    otherServices.value = dealerData.data().otherServices;
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
  await liff.init({ liffId: '1653520229-eDJywwyq' });
  lineDetail = await liff.getProfile();
  await fetchDealerData();
  document.querySelector('.pageloader').classList.remove('is-active');
});

document.getElementById('dealer-edit').addEventListener('submit', async e => {
  e.preventDefault();
  await init();
  initApp();
});
