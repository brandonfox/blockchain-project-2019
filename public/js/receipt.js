import { web3, userContract, init } from './userContract';
import firebase from './firebase-init';
import 'firebase/firebase-firestore';
import { log } from 'util';

const db = firebase.firestore();
const { liff } = window;

let dealerId; // The QR opener
let userId;
let userIdFromQrCode;
let dealRealId;
let _userContract;
let carPlates;
let userCarDetails;
let carRecords;
let newCar = false;

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

    console.log('Inserting record');
    const result = await _userContract.insertRecord(
      dealerId,
      userId,
      carPlate,
      services,
      subServices,
      comment,
      new Date().getTime(),
      { from: accounts[0] }
    );
    console.log('Inserted record');

    if (newCar) {
      const carDetails = {
        brand: document.getElementById('carBrand').value,
        model: document.getElementById('carModel').value,
        year: document.getElementById('carYear').value
      };
      console.log(carDetails);
      _userContract.editCarDetails(userId, carPlate, carDetails, {
        from: accounts[0]
      });
    }
    if (result.receipt.status) {
      const dealerRecords = await db
        .collection('Records')
        .doc(userIdFromQrCode)
        .get();
      if (!dealerRecords.exists) {
        console.log('Dealer records do not exist');
        await db
          .collection('Records')
          .doc(userIdFromQrCode)
          .set({});
      }
      console.log('Adding dealer record');
      await db
        .collection('Records')
        .doc(userIdFromQrCode)
        .collection('Entries')
        .add({
          dealerId: dealRealId,
          userId,
          carPlate,
          services,
          subServices,
          comment,
          date: new Date().getTime()
        });
      console.log('Added dealer record');
      alert('การทำรายการสำเร็จ');
      liff.closeWindow();
    }
  } catch (err) {
    console.log('err', err);
  }
};

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
  // await liff.init({ liffId: '1653520229-vA50WW0A' });
  // console.log('window.location.search', window.location.search);
  // const queryString = decodeURIComponent(window.location.search).replace(
  //   '?liff.state=',
  //   ''
  // );
  // console.log('queryString', queryString);
  // const params = new URLSearchParams(queryString);
  // userIdFromQrCode = params.get('userId');
  // console.log('userIdFromQrCode', userIdFromQrCode);
  // const dealerLiffId = await liff.getProfile();
  await init();
  // dealRealId = dealerLiff.userId;
  _userContract = await userContract.deployed();
  // dealerId = await _userContract.getHash(dealerLiffId.userId);
  //  userId = await _userContract.getHash(userIdFromQrCode);
  userId = await _userContract.getHash('Yes');
  dealerId = userId;
  console.log(userId);
  // if(!await _userContract.isVerified(dealerId)){
  //   liff.close
  // }
  const carPlates = await _userContract.getCarPlates(userId);
  let cars = '';
  for (let i = 0; i < carPlates.length; i++) {
    cars += `<option value="${carPlates[i]}"></option>`;
  }
  document.getElementById('carPlates').innerHTML = cars;
  document.querySelector('.pageloader').classList.remove('is-active');
});

document.getElementById('receipt').addEventListener('submit', async e => {
  e.preventDefault();
  initApp();
});

let gotDetailsBool = false;
let gotRecordsBool = false;

function gotDetails(callerPlate, data) {
  const v = document.getElementById('car-plate').value;
  if (v === callerPlate) {
    userCarDetails = data;
    let carDetails = '';
    if (data.brand !== '') {
      carDetails +=
        '<div class="form-row"><label for="carBrand">ยี่ห้อรถ</label>';
      carDetails += `<input id="carBrand" name="carBrand" type="text" value="${userCarDetails.brand}" readonly disabled/>`;
      carDetails += '</div>';
      carDetails +=
        '<div class="form-row"><label for="carModel">รุ่นของรถ</label>';
      carDetails += `<input id="carModel" name="carModel" type="text" value="${userCarDetails.model}" readonly disabled/>`;
      carDetails += '</div>';
      carDetails +=
        '<div class="form-row"><label for="carYear">ปีที่ผลิตรถ</label>';
      carDetails += `<input id="carYear" name="carYear" type="text" value="${userCarDetails.year}" readonly disabled/>`;
      carDetails += '</div>';
      carDetails +=
        '<div class="form-row"><button style="width: 100%; height: 40px;" type="button" onclick="openModal()">ดูประวัติ</button></div>';
      document.getElementById('carDataArea').innerHTML += carDetails;
      newCar = false;
    } else {
      carDetails +=
        '<div class="form-row"><label for="carBrand">Car Brand</label>';
      carDetails +=
        '<input id="carBrand" name="carBrand" type="text" value="" required/>';
      carDetails += '</div>';
      carDetails +=
        '<div class="form-row"><label for="carModel">Car Model</label>';
      carDetails +=
        '<input id="carModel" name="carModel" type="text" value="" required/>';
      carDetails += '</div>';
      carDetails +=
        '<div class="form-row"><label for="carYear">Car Year</label>';
      carDetails +=
        '<input id="carYear" name="carYear" type="text" value="" required/>';
      carDetails += '</div>';
      carDetails +=
        '<div class="form-row"><button style="width: 100%; height: 40px;" type="button" onclick="openModal()">ดูประวัติ</button></div>';
      document.getElementById('carDataArea').innerHTML += carDetails;
      newCar = true;
    }
    gotDetailsBool = true;
    checkStatus();
  }
}

function checkStatus() {
  if (gotDetailsBool && gotRecordsBool) {
    document.getElementById('retrieveDetailLoader').remove();
  }
}

function gotRecords(callerPlate, data) {
  const v = document.getElementById('car-plate').value;
  if (v === callerPlate) {
    carRecords = data;
    populateModal(data);
    gotRecordsBool = true;
    checkStatus();
  }
}

document.getElementById('car-plate').addEventListener('change', function() {
  console.log('value changed');
  gotRecordsBool = false;
  gotDetailsBool = false;
  const el = document.getElementById('carDataArea');
  const v = document.getElementById('car-plate').value;
  el.innerHTML = '<div id="retrieveDetailLoader" class="loader"></div>';
  _userContract.getRecords(v).then(result => {
    gotRecords(v, result);
  });
  _userContract.getCarDetails(v).then(result => {
    gotDetails(v, result);
  });
});
