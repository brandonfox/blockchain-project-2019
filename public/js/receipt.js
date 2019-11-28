import { web3, userContract, init } from './userContract';
import firebase from './firebase-init';
import 'firebase/firebase-firestore';

const db = firebase.firestore();
const { liff } = window;
var dealerId; // The QR opener
var userIdFromQrCode;
var _userContract;
var _userId;
const initApp = async () => {
  try {
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
    const accounts = await web3.eth.getAccounts();
    await _userContract.deployed();

    const dealerInfo = await _userContract.getDealerInfo(dealerId);
    const userInfo = await _userContract.getUserInfo(_userId);

    const { firstName, lastName } = userInfo;
    const verified = await _userContract.isVerified(dealerId);
    if (verified) {
      const result = await _userContract.insertRecord(
        dealerId,
        _userId,
        carPlate,
        services,
        subServices,
        comment,
        new Date().getTime(),
        { from: accounts[0] }
      );

      if (result.receipt.status) {
        await db
          .collection('Records')
          .doc(userIdFromQrCode)
          .collection('Entries')
          .add({
            dealerName: dealerInfo.dealerName,
            userName: `${firstName} ${lastName}`,
            carPlate,
            services,
            subServices,
            comment,
            date: new Date()
          });
        alert('การทำรายการสำเร็จ');
        liff.closeWindow();
      }
    }
  } catch (err) {
    debug.innerText = err;
  }
};

window.addEventListener('DOMContentLoaded', async () => {
  await liff.init({ liffId: '1653520229-vA50WW0A' });

  // ==========================REMOVE THIS YOU DEAD LOL JUST JOKING===============
  const queryString = decodeURIComponent(window.location.search).replace(
    '?liff.state=',
    ''
  );
  const params = new URLSearchParams(queryString);
  userIdFromQrCode = params.get('userId');
  const dealerLiffId = await liff.getProfile();
  await init();
  _userContract = await userContract.deployed();
  dealerId = await userContract.getHash(dealerLiffId.userId);
  _userId = await _userContract.getHash(userIdFromQrCode);
  _userContract.getCarPlates(_userId).then(result => {
    var cars = "";
    for(var i = 0; i < result.length; i++){
      cars += '<option value="' + result[i] + '"></option>';
    }
    document.getElementById("carPlates").innerHTML = cars;
  })
  // ========================DEBUG PURPOSE ====================================
  try {
    const debug = document.getElementById('debug');
    const P = document.createElement('p');
    const P2 = document.createElement('p');
    P.innerText = userIdFromQrCode;
    P2.innerText = dealerId;
    debug.append(P);
    debug.append(P2);
  } catch (err) {
    debug.innerText = err;
  }
  // =============================================================================
});

document.getElementById('receipt').addEventListener('submit', async e => {
  e.preventDefault();
  await init();
  initApp();
});
