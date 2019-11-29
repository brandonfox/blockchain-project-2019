import request from 'request-promise-native';
import { web3, userContract, init } from './userContract';
import firebase from './firebase-init';
import 'firebase/firebase-firestore';

const DB = firebase.firestore();
const APPLICATION_REF = DB.collection('Applications');
const DEALER_REF = DB.collection('Dealers');
const TABLE = document.getElementsByTagName('tbody')[0];
let userContractInstance;
let accounts;

const initContract = async () => {
  userContractInstance = await userContract.deployed();
  accounts = await web3.eth.getAccounts();
};

const changeStatus = (verified, id) => {
  const TR = document.getElementById(id);
  const a = TR.querySelector('a');
  if (verified) {
    a.innerText = 'ยืนยันตัวแล้ว';
    a.classList.add('disabled');
  } else {
    a.innerText = 'ยืนยันตน';
  }
};

const rejectOnBlockchain = async id => {
  const hash = await userContractInstance.getHash(id);

  const result = await userContractInstance.rejectApplication(hash, {
    from: accounts[0]
  });
  if (result.receipt.status) {
    await APPLICATION_REF.doc(id).delete();
  }
};

const verifyOnBlockchain = async id => {
  try {
    const hash = await userContractInstance.getHash(id);

    const result = await userContractInstance.approveApplication(hash, {
      from: accounts[0]
    });

    if (result.receipt.status) {
      changeStatus(true, id);
      const dealerApplication = await APPLICATION_REF.doc(id).get();
      DEALER_REF.doc(id).set(
        { ...dealerApplication.data(), verified: true },
        { merge: true }
      );
      await APPLICATION_REF.doc(id).delete();
      // push message to dealer that their application has been verified.
      const url =
        'https://asia-east2-user-oranoss-chjtic.cloudfunctions.net/d_confirm';
      const options = {
        method: 'POST',
        uri: url,
        body: {
          userId: id
        },
        json: true
      };
      await request(options);
    }
  } catch (err) {
    console.error(`ERR: ${err}`);
  }
  // checkVerified(hash);
};

const verifyClicked = e => {
  e.stopPropagation();
  // eslint-disable-next-line no-restricted-globals
  if (confirm('ยืนยันดีลเลอร์คนนี้')) {
    const id = e.target.getAttribute('data-id');
    verifyOnBlockchain(id);
  }
};

const rejectClicked = e => {
  e.stopPropagation();
  if (confirm('ปฎิเสธดีลเลอร์ ?')) {
    const id = e.target.getAttribute('data-idr');
    rejectOnBlockchain(id);
  }
};

const btnRender = (verified, a, id, code) => {
  switch (code) {
    case 'V':
      a.innerText = `${verified ? 'ยืนยันตัวตันแล้ว' : 'ยืนยันตัวตน'}`;
      if (verified) {
        a.classList.add('disabled');
      } else {
        a.setAttribute('data-id', id);
        a.addEventListener('click', verifyClicked);
      }
      break;
    case 'R':
      a.innerText = 'ปฎิเสธ';
      a.setAttribute('style', 'color: red');
      a.setAttribute('data-idr', id);
      a.addEventListener('click', rejectClicked);
  }
};

const renderTable = (dealerInfo, id) => {
  const { verified } = dealerInfo;
  const TR = document.createElement('tr');
  const companyNameTD = document.createElement('td');
  const firstNameTD = document.createElement('td');
  const lastNameTD = document.createElement('td');
  const phoneTD = document.createElement('td');
  const aTD = document.createElement('td');
  aTD.setAttribute('style', 'display: flex; justify-content: space-evenly;');
  const a = document.createElement('a');
  const a2 = document.createElement('a');
  btnRender(verified, a, id, 'V');
  btnRender(verified, a2, id, 'R');

  companyNameTD.innerText = dealerInfo.dealerName;
  firstNameTD.innerText = dealerInfo.firstName;
  lastNameTD.innerText = dealerInfo.lastName;
  phoneTD.innerText = dealerInfo.phoneNo;

  TR.setAttribute('id', id);
  aTD.appendChild(a);
  aTD.appendChild(a2);
  const dataArray = [companyNameTD, firstNameTD, lastNameTD, phoneTD, aTD];
  dataArray.forEach(dataEach => TR.appendChild(dataEach));
  TABLE.appendChild(TR);
};

window.addEventListener('DOMContentLoaded', async () => {
  await init();
  await initContract();
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll('.navbar-burger'),
    0
  );
  console.log('$navbarBurgers', $navbarBurgers);
  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach(el => {
      el.addEventListener('click', () => {
        // Get the target from the "data-target" attribute
        const { target } = el.dataset;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
    });
  }
});

APPLICATION_REF.onSnapshot(snapshot => {
  const docsChange = snapshot.docChanges();

  docsChange.forEach(eachDoc => {
    const { type } = eachDoc;
    const { doc } = eachDoc;
    const dealerInfo = doc.data();
    if (type === 'modified') {
      const dealerInfoElement = document.querySelectorAll(`#${doc.id}`);
      const { children } = dealerInfoElement[0];
      children[0].innerText = dealerInfo.dealerName;
      children[1].innerHTML = dealerInfo.firstName;
      children[2].innerHTML = dealerInfo.lastName;
      children[3].innerHTML = dealerInfo.phoneNo;
    } else if (type === 'added') {
      renderTable(dealerInfo, doc.id);
    }
  });
});
