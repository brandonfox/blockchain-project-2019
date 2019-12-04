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
    const map = document.createElement('div');
    map.style = 'height: 300px; width: 70%;'
    map.id = 'map';
    const mapScript = document.createElement('script');
    mapScript.innerHTML = `
    function initMap() {
    var dL = {lat: ${record.location._latitude}, lng: ${record.location._longitude}}
    var map = new google.maps.Map(document.getElementById('map'), {
      center: dL,
      zoom: 15,
      gestureHandling: 'greedy'
    })
    marker = new google.maps.Marker({
      position: dL,
      map: map
    });}`
    const mapApi = document.createElement('script');
    mapApi.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBaZQgp7e7cEXCWwo_d4-iWyc4kCzwXoMU&callback=initMap'
    mapApi.async = true;
    map.appendChild(mapScript);
    map.appendChild(mapApi);
    const lastName = document.createElement('p');
    lastName.classList.add('modal-text');
    lastName.innerText = `นามสกุล: ${record.lastName}`;
    const otherServices = document.createElement('p');
    otherServices.classList.add('modal-text');
    otherServices.innerHTML = `บริการอื่นๆ: ${record.otherServices}`;

    modalCardBody.appendChild(lastName);
    modalCardBody.appendChild(address);
    modalCardBody.appendChild(map);
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
  initApp();
});
