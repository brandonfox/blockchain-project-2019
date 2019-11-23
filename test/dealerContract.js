const DealerContract = artifacts.require('DealerContract');

contract('DealerContract', accounts => {
  let dealerContract = null;
  before(async () => {
    dealerContract = await DealerContract.deployed();
  });
  it('Should not be able to add employee', async () => {
    assert(dealerContract.address !== '');
    const dealerId = await dealerContract.getHash('32');
    const otherId = await dealerContract.getHash('34');
    let errorMsg = '';
    await dealerContract.addDealerEmployee(dealerId, otherId).catch(error => {
      errorMsg = error.reason;
    });
    assert(errorMsg === 'You must be a dealership owner to do this');
  });

  it('Should create an application', async () => {
    const dealerId = await dealerContract.getHash('32');
    const dealerInfo = {
      dealerName: 'test',
<<<<<<< HEAD:backend/test/dealerContract.js
      addr: 'mahidol',
      location: '192.12312,24.12',
      phoneNo: '081+++++++',
      availableServices: [],
      availableSubServices: []
=======
      firstName: 'test',
      lastName: 'test',
      addr: 'mahidol',
      location: '192.12312,24.12',
      phoneNo: '081+++++++',
      bestSeller: 'test',
      promotion: 'test',
      otherServices: 'test',
      availableServices: [],
      availableSubServices: [],
>>>>>>> refs/heads/receipt:test/dealerContract.js
    };
    await dealerContract.createDealerApplication(dealerInfo, dealerId);
    const application = await dealerContract.getAllDealerApplications();
    assert(application.includes(dealerId));
  });

  it('Should approve an application', async () => {
    const dealerId = await dealerContract.getHash('32');
    await dealerContract.approveApplication(dealerId);
    const application = await dealerContract.getAllDealerApplications();
    const verified = await dealerContract.isVerified(dealerId);
    assert(!application.includes(dealerId));
    assert(verified);
  });

<<<<<<< HEAD:backend/test/dealerContract.js
  it('should return the correct owner', async () => {
    const _ownerToBe = accounts[0];
    const ownerFromContract = await dealerContract.owner();
    assert.equal(_ownerToBe, ownerFromContract, 'owner must be the same');
=======
  it('Should add an employee', async () => {
    const dealerId = await dealerContract.getHash('32');
    const employeeId = await dealerContract.getHash('30');
    await dealerContract.addDealerEmployee(dealerId, employeeId);
    const verified = await dealerContract.isVerified(employeeId);
    assert(verified);
>>>>>>> refs/heads/receipt:test/dealerContract.js
  });
});
