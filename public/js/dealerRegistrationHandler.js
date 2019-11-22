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

async function submitForm(e) {
  console.log('doing form')
  event.preventDefault();
  var thisForm = $(e).find('[name="company-name"]');
    const dealerInfo = {
      dealerName: 'test',
      addr: 'mahidol',
      location: '192.12312,24.12',
      phoneNo: '081+++++++',
      availableServices: [],
      availableSubServices: []
    };
    const contract = getContract();
    const hash = await contract.methods.getHash('21').call();
    console.log(hash);
    await sendSigned(contract.methods.createDealerApplication(dealerInfo,hash));
    console.log('Sent signed transaction')
    const application = await contract.methods.getAllDealerApplications().call({from:account.address});
    console.log(application);
};

