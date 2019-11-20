const UserContract = artifacts.require('UserContract');
const testCarPlate = "NA34 87";
const testCar = {brand:'BMW',model:'Series 3',year:'1997'};

contract('UserContract',() => {
    let userContract = null;
    userId = '';
    before(async () => {
        userContract = await UserContract.deployed();
        userId = await userContract.getHash('TestUser');
    });
    it('Should create car record', async () => {
        await userContract.editCarDetails(userId,testCarPlate,testCar);
        const carDetails = await userContract.getCars(userId);
        assert(carDetails[0].brand === testCar.brand && carDetails[0].model === testCar.model && carDetails[0].year === testCar.year,'Record in blockchain[0] did not match testCar');
    });
    it('Should add user details', async () => {
        await userContract.editUserInfo(userId,{firstName:'Brandon',lastName:"Fox",adr:"Thailand somewhere",phNo:"Yes",email:"brandon@email.email"})
        const infoReply = await userContract.getUserInfo(userId);
        assert(infoReply.firstName === 'Brandon',"Record in the blockchain firstname did not match");
    });
    it('Should create a record', async () => {
        const dealerId = await userContract.getHash('32');
        const dealerInfo = { 
          dealerName:'test'
          ,addr:'mahidol'
          ,location:'192.12312,24.12'
          ,phoneNo:'081+++++++'
          ,availableServices:[]
          ,availableSubServices:[]
         };
        await userContract.createDealerApplication(dealerInfo, dealerId);
        let application = await userContract.getAllDealerApplications();
        assert(application.includes(dealerId), "Could not create dealer application");
        await userContract.approveApplication(dealerId);
        const verified = await userContract.isVerified(dealerId);
        application = await userContract.getAllDealerApplications();
        assert(!application.includes(dealerId), "Failed to delete approved dealer application from blockchain");
        assert(verified, "Dealer is still not verified");
        await userContract.insertRecord(dealerId,userId,testCarPlate,[],[],"Done some test maintenance");
        const records = await userContract.getRecords(userId,testCarPlate);
        assert(records[0].comment === "Done some test maintenance")
    })
})