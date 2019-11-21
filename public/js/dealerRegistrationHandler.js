// initilise the liff id first
var profile;
async function successCallback() {
  try {
    profile = await liff.getProfile();
    document.getElementById('result').innerText = JSON.stringify(profile);
  } catch (err) {
    console.error('err', err);
  }
}

function submitForm(e) {
  event.preventDefault();

  const companyName = e.target[0].value;
  const firstName = e.target[1].value;
  const lastName = e.target[2].value;
  const address = e.target[3].value;
  const tel = e.target[4].value;
  const bestSeller = e.target[5].value;
  const promotions = e.target[6].value;
  const mic = e.target[7].value;

  fetch('./build/contracts/DealerContract.json').then(async data => {
    const dataJSON = await data.json();
    console.log('data', dataJSON);
    var DealerContract = TruffleContract(dataJSON);
    var provider;
    ethereum.autoRefreshOnNetworkChange = false;

    if (typeof ethereum !== 'undefined') {
      provider = new Web3(ethereum);
      var accounts = await ethereum.enable();
      console.log(accounts);
      DealerContract.setProvider(web3.currentProvider);
    } else {
      provider = new Web3.providers.HttpProvider('http://localhost:7545');
      DealerContract.setProvider(provider);
    }
    console.log('provider', provider);

    const instance = await DealerContract.deployed();
    const contractInstance = instance;
    const owner = await contractInstance.owner();
    console.log('owner', owner);
    const dealerInfo = {
      dealerName: `${firstName} ${lastName}`,
      addr: `${address}`,
      location: '192.12312,24.12',
      phoneNo: `${tel}`,
      availableServices: [],
      availableSubServices: []
    };
    console.log('data', dealerInfo);
    const hash = await contractInstance.getHash('32');
    console.log(hash);
    await contractInstance.createDealerApplication(dealerInfo, hash, {
      from: accounts[0]
    });
    await contractInstance.getAllDealerApplications();
    // console.log(application);
  });
}

document
  .getElementById('registration-form')
  .addEventListener('submit', submitForm);
// initialise Web3 to do smart contract
