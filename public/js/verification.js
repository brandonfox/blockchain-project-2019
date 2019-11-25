import { web3, userContract, init } from './userContract';
import firebase from './firebase-init';
import 'firebase/firebase-firestore';

const DB = firebase.firestore();
const DB_REF = DB.collection('Applications');
const TABLE = document.getElementsByTagName('tbody')[0];
let userContractInstance;
let accounts;

const initContract = async () => {
  userContractInstance = await userContract.deployed();
  accounts = await web3.eth.getAccounts();
};

const renderTable = (dealerInfo, id) => {
  const { verified } = dealerInfo;
  const TR = document.createElement('tr');
  const companyNameTD = document.createElement('td');
  const firstNameTD = document.createElement('td');
  const lastNameTD = document.createElement('td');
  const phoneTD = document.createElement('td');
  const btnTD = document.createElement('td');
  const btn = document.createElement('button');
  btnRender(verified, btn, id);

  companyNameTD.innerText = dealerInfo.dealerName;
  firstNameTD.innerText = dealerInfo.firstName;
  lastNameTD.innerText = dealerInfo.lastName;
  phoneTD.innerText = dealerInfo.phoneNo;

  TR.setAttribute('id', id);
  btnTD.appendChild(btn);
  const dataArray = [companyNameTD, firstNameTD, lastNameTD, phoneTD, btnTD];
  dataArray.forEach(dataEach => TR.appendChild(dataEach));
  TABLE.appendChild(TR);
};

const btnRender = (verified, btn, id) => {
  btn.innerText = `${verified ? 'ยืนยันตัวตันแล้ว' : 'ยืนยันตัวตน'}`;
  if (verified) {
    btn.disabled = true;
  } else {
    btn.setAttribute('data-id', id);
    btn.setAttribute('class', 'verify-button');
    btn.setAttribute('type', 'button');
    btn.addEventListener('click', verifyClicked);
  }
};

async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Bearer zCyEDn4jZWQ5n7CPdK8lIy0leAQoE5QF3/uY53ND6hQP4C45g9royk/A8r7/p4PhJ9CKEjVgICZ0m7yH8RbX0is5UfMeogWS/Gxhfn3Q7U9Ry9/z8IWeEHjvHmeoSJjXEC/AmfcLUFYpaF0Ecdn5QgdB04t89/1O/w1cDnyilFU='
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}

const verifyOnBlockchain = async id => {
  try {
    const hash = await userContractInstance.getHash(id);

    const result = await userContractInstance.approveApplication(hash, {
      from: accounts[0],
    });

    if (result.receipt.status) {
      DB_REF.doc(id).set({ verified: true }, { merge: true });
      // push message to dealer that their application has been verified.
      const url = 'https://api.line.me/v2/bot/message/push';
      try {
        const data = await postData(url, {
          to: id,
          messages: [
            {
              type: 'text',
              text:
                'ร้านค้าของท่าน ได้รับการอนุมัติจากบริษัท Oranoss เรียบร้อยครับ'
            }
          ]
        });
        console.log(JSON.stringify(data)); // JSON-string from `response.json()` call
      } catch (error) {
        console.error(error);
      }
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
