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
  var thisForm = $(e).find('[name="company-name"]');
  console.log(thisForm.val());

  $.getJSON('./build/contracts/DealerContract.json', async data => {
    var DealerContract = TruffleContract(data);
    ethereum.autoRefreshOnNetworkChange = false;
    if (typeof web3 !== 'undefined') {
      var provider = new Web3(ethereum);
      var accounts = await ethereum.enable();
      console.log(accounts);
      DealerContract.setProvider(web3.currentProvider);
    } else {
      var provider = new Web3.providers.HttpProvider('http://localhost:7545');
      DealerContract.setProvider(provider);
    }

    const instance = await DealerContract.deployed();
    const contractInstance = instance;
    const owner = await contractInstance.owner();
    console.log('owner', owner);
    const dealerInfo = {
      dealerName: 'test',
      addr: 'mahidol',
      location: '192.12312,24.12',
      phoneNo: '081+++++++',
      availableServices: [],
      availableSubServices: []
    };
    const hash = await contractInstance.getHash('32');
    console.log(hash);
    // await contractInstance.createDealerApplication(dealerInfo, hash, {
    //   from: accounts[0]
    // });
    const application = await contractInstance.getAllDealerApplications();
    console.log(application);
  });
}
// initialise Web3 to do smart contract
