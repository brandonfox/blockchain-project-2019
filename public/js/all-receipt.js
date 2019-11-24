import firebase from './firebase-init';
import 'firebase/firebase-firestore';

const db = firebase.firestore();

const initApp = async () => {
  const recordInternals = [];
  await db
    .collection('Records')
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        recordInternals.push(doc.data().recordInternal);
      });
    })
    .catch(function(error) {
      console.log('Error getting documents: ', error);
    });
  recordInternals.forEach(record => {
    const tr = document.createElement('tr');
    const td0 = document.createElement('td');
    const text0 = document.createTextNode(record.dealerName);
    const td1 = document.createElement('td');
    const text1 = document.createTextNode(record.userName);
    const td2 = document.createElement('td');
    const text2 = document.createTextNode(record.testCarPlate);
    const td3 = document.createElement('button');
    td3.className = 'more-info-button';
    const span = document.createElement('span');
    span.className = 'more-info-icon';
    // const text3 = document.createTextNode(record.dealerName);
    td0.appendChild(text0);
    td1.appendChild(text1);
    td2.appendChild(text2);
    // span.appendChild(text3);
    td3.appendChild(span);
    tr.appendChild(td0);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    document.getElementById('receipts-table').appendChild(tr);
  });
};

window.addEventListener('DOMContentLoaded', async () => {
  initApp();
});
