import { web3, userContract, init } from './userContract';
import firebase from './firebase-init';
import 'firebase/firebase-firestore';

const db = firebase.firestore();

const initApp = async () => {
  const userContractInstance = await userContract.deployed();
  const accounts = await web3.eth.getAccounts();

  const res = [];
  const recordsRef = await db.collection('Records').get();
  for (const record of recordsRef.docs) {
    const entriesRef = await db
      .collection('Records')
      .doc(record.id)
      .collection('Entries')
      .get();
    for (const entry of entriesRef.docs) {
      res.push(entry.data());
    }
  }

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
    
    record.bservices.forEach((service, _index) => {
      const modalP0 = document.createElement('p');
      modalP0.className = 'modal-text';
      const modalPText0 = document.createTextNode(
        `${service}: ${record.bsubServices[_index]}`
      );
      modalP0.appendChild(modalPText0);
      modalCardBody.appendChild(modalP0);
    });
    const modalP = document.createElement('p');
    const modalPText = document.createTextNode(
      `บริการอื่นๆ ที่ทางร้านทำ: ${record.comment}`
    );

    modalP.appendChild(modalPText);
    modalCardBody.appendChild(modalP);
    modal.appendChild(modalCard);
    document.body.appendChild(modal);

    const tr = document.createElement('tr');
    const td0 = document.createElement('td');
    const dealerInfo = userContractInstance.getDealerInfo(record.dealerId, {
      from: accounts[0],
    });
    const text0 = document.createTextNode(dealerInfo.dealerName);
    const td1 = document.createElement('td');
    const userInfo = userContractInstance.getUserInfo(record.userId, {
      from: accounts[0],
    });
    const text1 = document.createTextNode(userInfo.firstName);
    const td2 = document.createElement('td');
    const text2 = document.createTextNode(record.carPlate);
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
    const text3 = document.createTextNode('กดเลย');
    td0.appendChild(text0);
    td1.appendChild(text1);
    td2.appendChild(text2);
    a.appendChild(text3);
    td3.appendChild(a);
    tr.appendChild(td0);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    document.getElementsByTagName('tbody')[0].appendChild(tr);
  });
};

window.addEventListener('DOMContentLoaded', async () => {
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
  await init();
  initApp();
});
