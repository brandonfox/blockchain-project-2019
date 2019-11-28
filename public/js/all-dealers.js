import firebase from './firebase-init';
import 'firebase/firebase-firestore';

const db = firebase.firestore();

const initApp = async () => {
  const res = [];
  const dealersRef = await db.collection('Dealers').get();
  for (const dealers of dealersRef.docs) {
    res.push(dealers.data());
  }
  console.log('res', res);

  res.forEach((record, index) => {
    const modal = document.createElement('div');
    modal.id = `modal-${index}`;
    modal.className = 'modal';
    const modalBackground = document.createElement('div');
    modalBackground.classList.add('modal-background');
    modal.appendChild(modalBackground);
    const modalCard = document.createElement('div');
    modalCard.classList.add('modal-card');
    const modalCardBody = document.createElement('section');
    modalCardBody.classList.add('modal-card-body');
    modalCardBody.style.borderBottomRightRadius = '6px';
    modalCardBody.style.borderBottomLeftRadius = '6px';
    const modalCardHeader = document.createElement('header');
    modalCardHeader.classList.add('modal-card-head');
    const modalCardHeaderTitle = document.createElement('p');
    modalCardHeaderTitle.classList.add('modal-card-title');
    const modalCardHeaderTitleText = document.createTextNode('ข้อมูลเพิ่มเติม');
    const modalCardHeaderClose = document.createElement('button');
    modalCardHeaderClose.classList.add('delete');
    modalCardHeaderTitle.appendChild(modalCardHeaderTitleText);
    modalCardHeader.appendChild(modalCardHeaderTitle);
    modalCardHeader.appendChild(modalCardHeaderClose);
    modalCard.appendChild(modalCardHeader);
    modalCard.appendChild(modalCardBody);

    const address = document.createElement('p');
    address.classList.add('modal-text');
    address.innerText = `ที่อยู่: ${record.addr}`;
    const lastName = document.createElement('p');
    lastName.classList.add('modal-text');
    lastName.innerText = `นามสกุล: ${record.lastName}`;
    const otherServices = document.createElement('p');
    otherServices.classList.add('modal-text');
    otherServices.innerHTML = `บริการอื่นๆ: ${record.otherServices}`;

    modalCardBody.appendChild(lastName);
    modalCardBody.appendChild(address);
    modalCardBody.appendChild(otherServices);
    modal.appendChild(modalCard);
    document.body.appendChild(modal);

    const tr = document.createElement('tr');
    const td0 = document.createElement('td');
    td0.innerText = `${record.dealerName}`;
    const td1 = document.createElement('td');
    td1.innerText = `${record.firstName}`;
    const td2 = document.createElement('td');
    td2.innerText = `${record.phoneNo}`;
    const td3 = document.createElement('td');
    const a = document.createElement('a');
    a.addEventListener('click', event => {
      event.preventDefault();
      modal.classList.add('is-active');

      modal.querySelector('.modal-background').addEventListener('click', e => {
        e.preventDefault();
        modal.classList.remove('is-active');
      });
      modalCardHeader.querySelector('.delete').addEventListener('click', e => {
        e.preventDefault();
        modal.classList.remove('is-active');
      });
    });
    a.innerText = 'กดเลย';
    td3.appendChild(a);
    tr.appendChild(td0);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    document.getElementsByTagName('tbody')[0].appendChild(tr);
  });
};

window.addEventListener('DOMContentLoaded', async () => {
  initApp();
});
