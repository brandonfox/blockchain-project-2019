import { web3, userContract, init } from './userContract';

let _contract;
let accounts;
let content;

const milliDay = 86400000;
const milliWeek = 604800000;
const milliMonth = 2628000000;

const initContract = async () => {
    _contract = await userContract.deployed();
    accounts = await web3.eth.getAccounts();
  };

window.addEventListener('DOMContentLoaded', async () => {
    await init();
    await initContract();
    content = document.getElementById('notification-container')
    fetchServices();
});

let notificationTimes;
let services;
let retrievedNotifications = 0;

function gotNotificationTime(serviceIndex, data){
    notificationTimes[serviceIndex] = data;
    retrievedNotifications++;
    console.log(`Got ${retrievedNotifications} total notifications`)
    checkNotifications();
}

function checkNotifications(){
    if(retrievedNotifications == services.length){
        console.log('Got all notificationtimes')
        displayData();
    }
}

const periods = ["Months","Weeks","Days"];

function displayData(){
    let h = '';
    for(let i = 0; i < services.length; i++){
        let timePeriod = getTimePeriod(notificationTimes[i]);
        h += '<tr class="notificaion-container">'
        h += `<td><div for="notification-time-${services[i]}" class="company-noti">${services[i]}</div></td>`
        h += `<td><input type="number" id="notification-time-${services[i]}" value="${timePeriod.time}"/></td>`
        h += `<td><select class="select" id="notification-period-${services[i]}" name="period">`
        for(let x = 0; x < periods.length; x++){
            h += '<option ';
            if(timePeriod.period == x){
                h += 'selected ';
            }
            h += `value="${periods[x]}">${periods[x]}</option>`
        }
        h += '</select></td>'
        h += `<td><button id="notification-${services[i]}-button" name="period">ยื่นยัน</button></td>`
        // h += '</form>'
        h += '</td>'
    }
    content.innerHTML = h;
    for(let i = 0; i < services.length; i++){
        document.getElementById(`notification-form-${services[i]}`).addEventListener('submit', async e => {
            e.preventDefault();
            const button = document.getElementById(`notification-${services[i]}-button`);
            button.disabled = true;
            button.innerText = 'Setting...'
            _contract.setServiceNotificationTime(services[i],getAdjustedTime(i),{from: accounts[0]}).then(() => {
                alert("Successfully set notification")
                fetchServices();
            }).catch(() => {
                alert("Something went wrong");
                fetchServices();
            })
        })
    }
}

function getAdjustedTime(index){
    const time = document.getElementById(`notification-time-${services[index]}`).value;
    const period = document.getElementById(`notification-period-${services[index]}`).value;
    if(period === periods[0]){
        return time * milliMonth;
    }
    else if(period === periods[1]){
        return time * milliWeek;
    }
    else{
        return time * milliDay;
    }
}

function getTimePeriod(no){
    if(no%milliMonth == 0){
        return { period: 0, time: no/milliMonth }
    }
    else if(no % milliWeek == 0){
        return { period: 1, time: no/milliWeek};
    }
    else{
        return { period: 2, time: no/milliDay};
    }
}

function setServices(data){
    services = data;
    notificationTimes = [services.length];
    console.log('got services');
    console.log(data)
    if(services.length == 0){
        checkNotifications();
        return;
    }
    for(let i = 0; i < services.length; i++){
        _contract.notificationTimes(services[i]).then(result => {gotNotificationTime(i,result)});
    }
}

function fetchServices(){
    retrievedNotifications = 0;
    content.innerHTML = '<div class="loader" id="servicesLoader"></div>'
    console.log('fetching services')
    _contract.getServices().then(setServices);
}