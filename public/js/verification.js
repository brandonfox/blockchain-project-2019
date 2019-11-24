import { web3, userContract, init } from './userContract';
import firebase from './firebase-init';
import 'firebase/firebase-firestore';

const DB = firebase.firestore();
const DB_REF = DB.collection('Applications');
const TABLE = document.getElementById('dealers-table');
var userContractInstance;
var accounts;

const initContract = async () => {
  userContractInstance = await userContract.deployed();
  accounts = await web3.eth.getAccounts();
};
const verifyOnBlockchain = async id => {
  const application = await userContractInstance.getAllDealerApplications({
    from: accounts[0]
  });

  const hash = await userContractInstance.getHash(id);

  const result = await userContractInstance.approveApplication(hash, {
    from: accounts[0]
  });

  if (result.receipt.status) {
    DB_REF.doc(id).set({ verified: true }, { merge: true });
  }
};

const renderTable = (dealerInfo, id) => {
  const TR = document.createElement('tr');
  const companyNameTD = document.createElement('td');
  const firstNameTD = document.createElement('td');
  const lastNameTD = document.createElement('td');
  const phoneTD = document.createElement('td');
  const btnTD = document.createElement('td');
  const btn = document.createElement('button');

  companyNameTD.innerText = dealerInfo.dealerName;
  firstNameTD.innerText = dealerInfo.firstName;
  lastNameTD.innerText = dealerInfo.lastName;
  phoneTD.innerText = dealerInfo.phoneNo;
  btn.innerText = 'Verify';
  TR.setAttribute('data-id', id);
  btn.setAttribute('data-id', id);
  btn.setAttribute('class', 'verify-button');
  btn.setAttribute('type', 'button');
  btn.addEventListener('click', verifyClicked);
  btnTD.appendChild(btn);
  const dataArray = [companyNameTD, firstNameTD, lastNameTD, phoneTD, btnTD];
  dataArray.forEach(dataEach => TR.appendChild(dataEach));
  TABLE.appendChild(TR);
};

const verifyClicked = async e => {
  e.stopPropagation();
  const id = e.target.getAttribute('data-id');

  verifyOnBlockchain(id);

  // do verification Process.
};

window.addEventListener('DOMContentLoaded', async () => {
  await init();
  await initContract();
});

// TODO: Change this to Applications before deploying
let listener = DB_REF.onSnapshot(snapshot => {
  const docsChange = snapshot.docChanges();

  docsChange.forEach(eachDoc => {
    const { type } = eachDoc;
    const doc = eachDoc.doc;
    const dealerInfo = doc.data();
    if (type === 'added' && !dealerInfo.verified) {
      renderTable(dealerInfo, doc.id);
    }
  });
});
