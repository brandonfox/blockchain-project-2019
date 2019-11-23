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

  it('Should add an employee', async () => {
    const dealerId = await dealerContract.getHash('32');
    const employeeId = await dealerContract.getHash('30');
    await dealerContract.addDealerEmployee(dealerId, employeeId);
    const verified = await dealerContract.isVerified(employeeId);
    assert(verified);
  });
});
