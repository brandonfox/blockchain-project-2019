const DealerContract = artifacts.require('DealerContract');

contract('DealerContract', () => {
  // it('Should add employee once only', async () => {
  //   const dealerContract = await DealerContract.deployed();
  //   assert(dealerContract.address !== '');
  //   const dealerId = await dealerContract.getHash('32');
  //   const otherId = await dealerContract.getHash('34');
  //   let errorMsg;
  //   await dealerContract.addDealerEmployee(dealerId, otherId).catch(error => {
  //     errorMsg = error.reason;
  //   });
  //   assert(errorMsg === 'You must be a dealership owner to do this');
  //   const reply = await dealerContract.transferOwner('0x0000000000000000000000000000000000000000');
  //   console.log(reply);
  // });
});
