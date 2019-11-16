const DealerContract = artifacts.require('DealerContract');

contract('DealerContract', () => {
  let dealerContract = null;
  before(async () => {
    dealerContract = await DealerContract.deployed();
  });
  it('Should not be able to add employee', async () => {
    assert(dealerContract.address !== '');
    const dealerId = await dealerContract.getHash('32');
    const otherId = await dealerContract.getHash('34');
    let errorMsg;
    await dealerContract.addDealerEmployee(dealerId, otherId).catch(error => {
      errorMsg = error.reason;
    });
    assert(errorMsg === 'You must be a dealership owner to do this');
  });
});
