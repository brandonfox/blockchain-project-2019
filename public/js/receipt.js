import { web3, userContract, init } from './userContract';
import firebase from './firebase-init';
import 'firebase/firebase-firestore';

const db = firebase.firestore();
const { liff } = window;

let dealerId; // The QR opener
let userIdFromQrCode;
let _userContract;
let _userId;
let carPlates;
let userCarDetails;
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
    console.log('Got accounts');

    console.log('Inserting record');
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
    console.log('Inserted record');
    if (newCar) {
      const carDetails = {
        brand: document.getElementById('carBrand').value,
        model: document.getElementById('carModel').value,
        year: document.getElementById('carYear').value,
      };
      console.log('carDetails', carDetails);
      _userContract.editCarDetails(_userId, carPlate, carDetails);
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
          dealerId,
          userId: _userId,
          carPlate,
          services,
          subServices,
          comment,
          date: new Date().getTime(),
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
  await liff.init({ liffId: '1653520229-vA50WW0A' });
  console.log('window.location.search', window.location.search);
  const queryString = decodeURIComponent(window.location.search).replace(
    '?liff.state=',
    ''
  );
  console.log('queryString', queryString);
  const params = new URLSearchParams(queryString);
  userIdFromQrCode = params.get('userId');
  console.log('userIdFromQrCode', userIdFromQrCode);
  const dealerLiffId = await liff.getProfile();
  await init();
  _userContract = await userContract.deployed();
  dealerId = await _userContract.getHash(dealerLiffId.userId);
  _userId = await _userContract.getHash(userIdFromQrCode);
  console.log('_userId', _userId);
  carPlates = await _userContract.getCarPlates(_userId);
  console.log('carPlates', carPlates);
  let cars;
  carPlates.forEach(carPlate => {
    cars += `<option value="${carPlate}"></option>`;
  });
  document.getElementById('carPlates').innerHTML = cars;
  userCarDetails = await _userContract.getCars(_userId);
  document.querySelector('.pageloader').classList.remove('is-active');
});

document.getElementById('receipt').addEventListener('submit', async e => {
  e.preventDefault();
  initApp();
});

document.getElementById('car-plate').addEventListener('change', function() {
  console.log('Value changed');
  const v = document.getElementById('car-plate').value;
  let carDetails = '';
  for (let i = 0; i < carPlates.length; i += 1) {
    if (v === carPlates[i]) {
      carDetails +=
        '<div class="form-row"><label for="carBrand">ยี่ห้อรถ</label>';
      carDetails += `<input id="carBrand" name="carBrand" type="text" value="${userCarDetails[i].brand}" readonly disabled/>`;
      carDetails += '</div>';
      carDetails +=
        '<div class="form-row"><label for="carModel">รุ่นของรถ</label>';
      carDetails += `<input id="carModel" name="carModel" type="text" value="${userCarDetails[i].model}" readonly disabled/>`;
      carDetails += '</div>';
      carDetails +=
        '<div class="form-row"><label for="carYear">ปีผลิตของรถ</label>';
      carDetails += `<input id="carYear" name="carYear" type="text" value="${userCarDetails[i].year}" readonly disabled/>`;
      carDetails += '</div>';
      document.getElementById('carDataArea').innerHTML = carDetails;
      newCar = false;
      return;
    }
  }
  carDetails += '<div class="form-row"><label for="carBrand">ยี่ห้อรถ</label>';
  carDetails +=
    '<input id="carBrand" name="carBrand" type="text" value="" required/>';
  carDetails += '</div>';
  carDetails += '<div class="form-row"><label for="carModel">รุ่นของรถ</label>';
  carDetails +=
    '<input id="carModel" name="carModel" type="text" value="" required/>';
  carDetails += '</div>';
  carDetails +=
    '<div class="form-row"><label for="carYear">ปีผลิตของรถ</label>';
  carDetails +=
    '<input id="carYear" name="carYear" type="text" value="" required/>';
  carDetails += '</div>';
  document.getElementById('carDataArea').innerHTML = carDetails;
  newCar = true;
});
