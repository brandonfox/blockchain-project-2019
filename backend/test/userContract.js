const UserContract = artifacts.require('UserContract');

contract('UserContract', () => {
  let userContract = null;
  before(async () => {
    userContract = await UserContract.deployed();
  });

  it('Should edit user info', async () => {
    const userId = await userContract.getHash('32');
    const userInfo = {
      firstName: 'a',
      lastName: 'b',
      adr: 'c',
      phNo: 'd',
      email: 'e'
    };
    await userContract.editUserInfo(userId, userInfo);
    const user = await userContract.getUserInfo(userId);
    assert(user.firstName === 'a');
  });

  it('Should insert record', async () => {
    const dealerId = await userContract.getHash('31');
    const userId = await userContract.getHash('32');
    const dealerInfo = {
      dealerName: 'test'
    };
    await userContract.createDealerApplication(dealerInfo, dealerId);
    await userContract.approveApplication(dealerId);
    const verified = await userContract.isVerified(dealerId);
    assert(verified);
    await userContract.insertRecord(dealerId, userId, [], [], 'test');
    const records = await userContract.getRecords(dealerId, userId);
    assert(records[0].comment === 'test');
  });
});
