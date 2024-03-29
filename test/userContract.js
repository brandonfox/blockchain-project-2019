const UserContract = artifacts.require('UserContract');
const testCarPlate = 'NA34 87';
const testCar = { brand: 'BMW', model: 'Series 3', year: '1997' };

contract('UserContract', () => {
  let userContract = null;
  let userId = '';
  before(async () => {
    userContract = await UserContract.deployed();
    userId = await userContract.getHash('TestUser');
  });
  it('Should create car record', async () => {
    const carsBefore = await userContract.getCars(userId);
    await userContract.editCarDetails(userId, testCarPlate, testCar);
    const carsAfter = await userContract.getCars(userId);
    assert(carsBefore.length < carsAfter.length,'Number of cars before adding matches number of cars after');
    const i = carsAfter.length - carsBefore.length - 1;
    assert(carsAfter[i].brand === testCar.brand && 
      carsAfter[i].model === testCar.model && 
      carsAfter[i].year === testCar.year,'Car data does not match test data')
  });
  it('Should add user details', async () => {
    await userContract.editUserInfo(userId, {
      firstName: 'Brandon',
      lastName: 'Fox',
      adr: 'Thailand somewhere',
      phNo: 'Yes',
      email: 'brandon@email.email',
    });
    const infoReply = await userContract.getUserInfo(userId);
    assert(
      infoReply.firstName === 'Brandon',
      'Record in the blockchain firstname did not match'
    );
  });
  it('User should have saved car', async() => {
    const userCars = await userContract.getCars(userId);
    assert(userCars.length > 0,'User has no cars recorded');
  });
  it('Should create a record', async () => {
    const dealerId = await userContract.getHash('32');
    const dealerInfo = {
      dealerName: 'test',
      firstName: 'test',
      lastName: 'test',
      addr: 'mahidol',
      location: ['192.12312,24.12',"b"],
      phoneNo: '081+++++++',
      bestSeller: 'test',
      promotion: 'test',
      otherServices: 'test',
      availableServices: [],
      availableSubServices: [],
    };
    await userContract.createDealerApplication(dealerInfo, dealerId);
    let application = await userContract.getAllDealerApplications();
    assert(
      application.includes(dealerId),
      'Could not create dealer application'
    );
    await userContract.approveApplication(dealerId);
    const verified = await userContract.isVerified(dealerId);
    application = await userContract.getAllDealerApplications();
    assert(
      !application.includes(dealerId),
      'Failed to delete approved dealer application from blockchain'
    );
    assert(verified, 'Dealer is still not verified');
    await userContract.insertRecord(
      dealerId,
      userId,
      testCarPlate,
      [],
      [],
      'Done some test maintenance',
      1
    );
    const records = await userContract.getRecords(testCarPlate);
    assert(records[0].comment === 'Done some test maintenance',"Blockchain record comment does not match");
    const activeUsers = await userContract.getAllUsers();
    assert(activeUsers.length > 0,"No users were recorded");
  });
});
