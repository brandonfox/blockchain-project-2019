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

const verifyOnBlockchain = async id => {
  try {
    const hash = await userContractInstance.getHash(id);

    const result = await userContractInstance.approveApplication(hash, {
      from: accounts[0],
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
        'https://us-central1-user-oranoss-chjtic.cloudfunctions.net/line';
      const options = {
        method: 'POST',
        uri: url,
        body: {
          userId: id,
        },
        json: true,
      };
      await request(options);
    }
  } catch (err) {
    console.error(`ERR: ${err}`);
  }
  // checkVerified(hash);
};

const verifyClicked = async e => {
  e.stopPropagation();
  // eslint-disable-next-line no-restricted-globals
  if (confirm('ยืนยันดีลเลอร์คนนี้')) {
    const id = e.target.getAttribute('data-id');
    verifyOnBlockchain(id);
    // do the verfication process
  }
};

const btnRender = (verified, a, id) => {
  a.innerText = `${verified ? 'ยืนยันตัวตันแล้ว' : 'ยืนยันตัวตน'}`;
  if (verified) {
    a.classList.add('disabled');
  } else {
    a.setAttribute('data-id', id);
    a.addEventListener('click', verifyClicked);
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
  const a = document.createElement('a');
  btnRender(verified, a, id);

  companyNameTD.innerText = dealerInfo.dealerName;
  firstNameTD.innerText = dealerInfo.firstName;
  lastNameTD.innerText = dealerInfo.lastName;
  phoneTD.innerText = dealerInfo.phoneNo;

  TR.setAttribute('id', id);
  aTD.appendChild(a);
  const dataArray = [companyNameTD, firstNameTD, lastNameTD, phoneTD, aTD];
  dataArray.forEach(dataEach => TR.appendChild(dataEach));
  TABLE.appendChild(TR);
};

window.addEventListener('DOMContentLoaded', async () => {
  await init();
  await initContract();
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
