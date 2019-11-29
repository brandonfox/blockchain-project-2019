import { web3, userContract, init } from './userContract';

var _userContract;
var accounts;

window.addService = function(){
    const name = document.getElementById('new-service-name');
    _userContract.addService(name.value,{from: accounts[0]}).then(() => {
        name.value = '';
        alert('เพิ่มบริการใหม่สำเร็จแล้ว');
        fetchServices();
    }).catch(result => {
        console.log(result);
        alert('มีบริการอยู่แล้ว');
        fetchServices();
    })
}

function fetchServices(){
    console.log('Fetching services')
    showLoading('existing-services-content');
    const button = document.getElementById('new-service-button');
    button.disabled = false;
    button.innerText = 'เพิ่มบริการหลัก'
    _userContract.getServices().then(setServices)
}

async function initContract() {
    _userContract = await userContract.deployed();
    accounts = await web3.eth.getAccounts();
    fetchServices();
}

function addSubservice(data){
    const name = document.getElementById(`subservice-name-${data}`);
    _userContract.addSubService(data,name.value,{from: accounts[0]}).then(() => {
        name.value = '';
        alert('เพิ่มบริการย่อยใหม่สำเร็จแล้ว');
        fetchSubservices(data);
    }).catch(result => {
        console.log(result);
        alert('มีบริการย่อยอยู่แล้ว');
        fetchSubservices(data);
    })
}

function fetchSubservices(serviceName) {
    showLoading(`service-${serviceName}-content`)
    const button = document.getElementById(`subservice-name-${serviceName}`);
    button.disabled = false;
    button.innerText = 'เพิ่มบริการย่อย'
    _userContract.getSubServices(serviceName).then(result => {
        setSubservices(serviceName,result)
    })
}

function setSubservices(serviceName,subservices){
    console.log("setting subservices in" + serviceName)
    const subservicesLocation = document.getElementById(`service-${serviceName}-content`)
    subservicesLocation.innerHTML = '';
    for(let i = 0; i < subservices.length; i++){
        subservicesLocation.innerHTML += '<div>----------This is a divider----------</div>'
        subservicesLocation.innerHTML += '<div class="subservice-container">'
        subservicesLocation.innerHTML += `<div class="subserviceName">${subservices[i]}</div>`
        subservicesLocation.innerHTML += '</div>'
    }
}

function setServices(data){
    currentServices = data;
    const servicesLocation = document.getElementById('existing-services-content');
    var shtml = '';
    for(let i = 0; i < data.length; i++){
        shtml += '<div class="service-container">'
        shtml += `<button type="button" id="subservice-${data[i]}-master" class="service-${data[i]} collapsible">ชื่อบริการหลัก: ${data[i]}</div>`
        shtml += `<div class="service-title inline" >ชื่อบริการย่อย:</div>`
        shtml += `<form class="inline" id="add-subservice-${data[i]}">`
        shtml += `<input class="inline" type="text" id="subservice-name-${data[i]}" required/>`
        shtml += `<button id="subservice-name-${data[i]}-button" class="service-button">เพิ่มบริการย่อย</button>`
        shtml += `</form>`
        shtml += `<div id="service-${data[i]}-content" class="content"></div>`
        shtml += '</div>'
    }
    servicesLocation.innerHTML = shtml;
    for(let i = 0; i < data.length; i++){
        document.getElementById(`add-subservice-${data[i]}`).addEventListener('submit', async e => {
            e.preventDefault();
            const button = document.getElementById(`subservice-name-${data[i]}-button`);
            button.disabled = true;
            button.innerText = 'กำลังเพิ่มบริการย่อย...'
            addSubservice(data[i]);
        })
        fetchSubservices(data[i]);
        document.getElementById(`subservice-${data[i]}-master`).addEventListener("click", function() {
            this.classList.toggle("active");
            var content = document.getElementById(`service-${data[i]}-content`)
            if (content.style.display === "block") {
              content.style.display = "none";
            } else {
              content.style.display = "block";
            }
          });
    }
}

function showLoading(elId){
    const services = document.getElementById(elId);
    services.innerHTML = '<div class="loader" id="servicesLoader"></div>'
}

var currentServices;

window.addEventListener('DOMContentLoaded', async() => {
    await init();
    await initContract();
})

document.getElementById('add-service-form').addEventListener('submit', async e => {
    e.preventDefault();
    const button = document.getElementById('new-service-button');
    button.disabled = true;
    button.innerText = 'กำลังเพิ่มบริการ...'
    addService();
  });

