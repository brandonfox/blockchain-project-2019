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
let newCar = false;

const initApp = async () => {
  const debug = document.getElementById('debug');
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
      _userContract.editCarDetails(userId, carPlate, carDetails);
    }
    if (result.receipt.status) {
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
      alert('การทำรายการสำเร็จ');
      liff.closeWindow();
    }
  } catch (err) {
    console.error(err);
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
  // TODO Display page after this function has completed ONLY
  await liff.init({ liffId: '1653520229-vA50WW0A' });

  // // ==========================REMOVE THIS YOU DEAD LOL JUST JOKING===============
  const queryString = decodeURIComponent(window.location.search).replace(
    '?liff.state=',
    ''
  );
  const params = new URLSearchParams(queryString);
  userIdFromQrCode = params.get('userId');
  const dealerLiff = await liff.getProfile();
  await init();
  dealRealId = dealerLiff.userId;
  _userContract = await userContract.deployed();
  dealerId = await _userContract.getHash(dealRealId);
  userId = await _userContract.getHash(userIdFromQrCode);
  _userContract.getCarPlates(userId).then(result => {
    carPlates = result;
    let cars = '';
    for (let i = 0; i < result.length; i++) {
      cars += `<option value="${result[i]}"></option>`;
    }
    document.getElementById('carPlates').innerHTML = cars;
  });
  userCarDetails = await _userContract.getCars(userId);
  // document.querySelector('.pageloader').classList.remove('is-active');
  console.log('userId', userIdFromQrCode);
  console.log('userIdHashed', userId);
  console.log('dealerID', dealRealId);
  console.log('dealerIDHashed', dealerId);
  document.querySelector('.pageloader').classList.remove('is-active');
});

document.getElementById('receipt').addEventListener('submit', async e => {
  e.preventDefault();
  initApp();
});

document.getElementById('car-plate').addEventListener('change', function() {
  console.log('value changed');
  const v = document.getElementById('car-plate').value;
  let carDetails = '';
  for (let i = 0; i < carPlates.length; i++) {
    if (v === carPlates[i]) {
      carDetails +=
        '<div class="form-row"><label for="carBrand">Car Brand</label>';
      carDetails += `<input id="carBrand" name="carBrand" type="text" value="${userCarDetails[i].brand}" readonly disabled/>`;
      carDetails += '</div>';
      carDetails +=
        '<div class="form-row"><label for="carModel">Car Model</label>';
      carDetails += `<input id="carModel" name="carModel" type="text" value="${userCarDetails[i].model}" readonly disabled/>`;
      carDetails += '</div>';
      carDetails +=
        '<div class="form-row"><label for="carYear">Car Year</label>';
      carDetails += `<input id="carYear" name="carYear" type="text" value="${userCarDetails[i].year}" readonly disabled/>`;
      carDetails += '</div>';
      document.getElementById('carDataArea').innerHTML = carDetails;
      newCar = false;
      return;
    }
  }
  carDetails += '<div class="form-row"><label for="carBrand">Car Brand</label>';
  carDetails +=
    '<input id="carBrand" name="carBrand" type="text" value="" required/>';
  carDetails += '</div>';
  carDetails += '<div class="form-row"><label for="carModel">Car Model</label>';
  carDetails +=
    '<input id="carModel" name="carModel" type="text" value="" required/>';
  carDetails += '</div>';
  carDetails += '<div class="form-row"><label for="carYear">Car Year</label>';
  carDetails +=
    '<input id="carYear" name="carYear" type="text" value="" required/>';
  carDetails += '</div>';
  document.getElementById('carDataArea').innerHTML = carDetails;
  newCar = true;
});
