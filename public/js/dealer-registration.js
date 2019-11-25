import firebase from './firebase-init';
import 'firebase/firebase-firestore';
import { web3, userContract, init } from './userContract';

const db = firebase.firestore();
const DB_REF = db.collection('Applications');
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
  const result = await _userContract.createDealerApplication(
    dealerInfo,
    dealerId,
    {
      from: accounts[0],
    }
  );

  if (result.receipt.status) {
    await DB_REF.doc(lineDetail.userId).set({ ...dealerInfo, verified: false });
    alert('ขอบคุณสำหรับการลงทะเบียน');
    liff.closeWindow();
  }
};

window.addEventListener('DOMContentLoaded', async () => {
  const node = document.createElement('p');
  console.log('hi');
  try {
    await liff.init({ liffId: '1653520229-GRByEEyo' });
    await init();
    const UserContractInstance = await userContract.deployed();
    const lineDetail = await liff.getProfile();
    const doc = await DB_REF.doc(lineDetail.userId).get();

    if (doc.exists) {
      const data = doc.data();
      const { verified } = data;
      if (verified) {
        return liff.openWindow({
          url: 'https://liff.line.me/1653518966-m50e4GyQ',
        });
      }
    }
    // I want to confirm on chain as well below this just in case

    const hash = await UserContractInstance.getHash(lineDetail.userId);
    const isVerifiedOnChain = await UserContractInstance.isVerified(hash);
    if (isVerifiedOnChain) {
      liff.openWindow({
        url: 'https://liff.line.me/1653518966-m50e4GyQ',
      });
      return liff.closeWindow();
    }

    const _textNode = document.createTextNode(
      `lineDetail.userId: ${lineDetail.userId}}`
    );
    node.appendChild(_textNode);
    document.getElementById('container').appendChild(node);
  } catch (err) {
    console.error(err);
    const _textNode3 = document.createTextNode(err);
    node.appendChild(_textNode3);
    document.getElementById('container').appendChild(node);
  }
});

document
  .getElementById('dealer-registration')
  .addEventListener('submit', async e => {
    e.preventDefault();
    initApp();
  });
