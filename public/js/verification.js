import { web3, userContract, init } from './userContract';
import firebase from './firebase-init';
import 'firebase/firebase-firestore';
import request from 'request-promise-native';
const DB = firebase.firestore();
const DB_REF = DB.collection('Applications');
const TABLE = document.getElementsByTagName('tbody')[0];
let userContractInstance;
let accounts;

const initContract = async () => {
  userContractInstance = await userContract.deployed();
  accounts = await web3.eth.getAccounts();
};

const verifyOnBlockchain = async id => {
  try {
    const hash = await userContractInstance.getHash(id);

    const result = await userContractInstance.approveApplication(hash, {
      from: accounts[0]
    });

    if (result.receipt.status) {
      DB_REF.doc(id).set({ verified: true }, { merge: true });
      // push message to dealer that their application has been verified.
      const url =
        'https://us-central1-user-oranoss-chjtic.cloudfunctions.net/line';
      var options = {
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

const verifyClicked = async e => {
  e.stopPropagation();
  const id = e.target.getAttribute('data-id');

  verifyOnBlockchain(id);

  // do verification Process.
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

window.addEventListener('DOMContentLoaded', async () => {
  await init();
  await initContract();
});

DB_REF.onSnapshot(snapshot => {
  const docsChange = snapshot.docChanges();

  docsChange.forEach(eachDoc => {
    const { type } = eachDoc;
    const { doc } = eachDoc;
    const dealerInfo = doc.data();
    if (type === 'modified') {
      changeStatus(dealerInfo.verified, doc.id);
    } else if (type === 'added') {
      renderTable(dealerInfo, doc.id);
    }
  });
});
