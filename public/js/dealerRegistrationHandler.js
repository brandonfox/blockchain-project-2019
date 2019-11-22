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
    const dealerName = `${firstName}`;
    const hash = await contractInstance.getHash(`${firstName}`);
    console.log(hash);
    await contractInstance.createDealerApplication(dealerName, hash, {
      from: accounts[0]
    });

    const application = await contractInstance.getAllDealerApplications();
    console.log(application);

    const getDealerName = await contractInstance.getDealerInfo(hash);
    console.log(getDealerName);
  });
}

document
  .getElementById('registration-form')
  .addEventListener('submit', submitForm);
// initialise Web3 to do smart contract
