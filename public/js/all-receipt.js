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
  recordInternals.forEach((record, index) => {
    const modal = document.createElement('div');
    modal.id = `ex${index}`;
    modal.className = 'modal';
    const modalP = document.createElement('p');
    const modalPText = document.createTextNode(
      `บริการอื่น ๆ ที่ทางร้านทำ: ${record.comment}`
    );

    record.services.forEach((service, _index) => {
      const modalP0 = document.createElement('p');
      modalP0.className = 'modal-text';
      const modalPText0 = document.createTextNode(
        `${service}: ${record.subServices[_index]}`
      );
      modalP0.appendChild(modalPText0);
      modal.appendChild(modalP0);
    });
    modalP.appendChild(modalPText);
    modal.appendChild(modalP);
    document.body.appendChild(modal);

    const tr = document.createElement('tr');
    const td0 = document.createElement('td');
    const text0 = document.createTextNode(record.dealerName);
    const td1 = document.createElement('td');
    const text1 = document.createTextNode(record.userName);
    const td2 = document.createElement('td');
    const text2 = document.createTextNode(record.carPlate);
    const td3 = document.createElement('button');
    const a = document.createElement('a');
    a.setAttribute('href', `#ex${index}`);
    a.setAttribute('rel', 'modal:open');
    td3.className = 'more-info-button';
    const span = document.createElement('span');
    span.className = 'more-info-icon';
    td3.setAttribute('data-micromodal-trigger', 'modal-1');
    td0.appendChild(text0);
    td1.appendChild(text1);
    td2.appendChild(text2);
    a.appendChild(span);
    td3.appendChild(a);
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
