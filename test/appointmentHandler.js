const AppointmentContract = artifacts.require('AppointmentHandler');
const testCarPlate = 'NA34 87';
const testCar = { brand: 'BMW', model: 'Series 3', year: '1997' };

contract('AppointmentHandler', async () => {
    let appointmentContract = null;
    before(async() => {
        appointmentContract = await AppointmentContract.deployed();
    });
    const userId = await appointmentContract.getHash('testuser');
    const dealerId = await appointmentContract.getHash('32');
    const testAppointment = {
        userId: userId, 
        dealerId: dealerId,
        carPlate: testCarPlate,
        time: 2019112620
     }
    it('Should verify dealer', async() => {
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
    await appointmentContract.createDealerApplication(dealerInfo, dealerId);
    let application = await appointmentContract.getAllDealerApplications();
    assert(
      application.includes(dealerId),
      'Could not create dealer application'
    );
    await appointmentContract.approveApplication(dealerId);
    const verified = await appointmentContract.isVerified(dealerId);
    application = await appointmentContract.getAllDealerApplications();
    assert(
      !application.includes(dealerId),
      'Failed to delete approved dealer application from blockchain'
    );
    assert(verified, 'Dealer is still not verified');
    });
    it('Should create car record',async () => {
        const carsBefore = await appointmentContract.getCars(userId);
    await appointmentContract.editCarDetails(userId, testCarPlate, testCar);
    const carsAfter = await appointmentContract.getCars(userId);
    assert(carsBefore.length < carsAfter.length,'Number of cars before adding matches number of cars after');
    const i = carsAfter.length - carsBefore.length - 1;
    assert(carsAfter[i].brand === testCar.brand && 
      carsAfter[i].model === testCar.model && 
      carsAfter[i].year === testCar.year,'Car data does not match test data')
    });
    it('Should create appointment with dealer', async() => {
        await appointmentContract.createAppointment(testAppointment);
        const appoint = await appointmentContract.getUserAppointment(userId);
        const dealerAppoints = await appointmentContract.getPendingAppointments(dealerId);
        assert(appoint.userId === userId && appoint.dealerId === dealerId && appoint.carPlate === testCarPlate && appoint.time === testAppointment.time,'User appointment does not match test appointment');
        assert(dealerAppoints.length > 0);
        assert(dealerAppoints[0].userId === userId && dealerAppoints[0].dealerId === dealerId && dealerAppoints[0].carPlate === testCarPlate && dealerAppoints[0].time === testAppointment.time,'Dealer appointment does not match test appointment');
    });
    it('Should complete appointment', async() => {
        await appointmentContract.completeAppointment(testAppointment);
        const appoint = await appointmentContract.getUserAppointment(userId);
        const dealerAppoints = await appointmentContract.getPendingAppointments(dealerId);
        assert(appoint.userId === '','Appointment was not removed from userAppointment');
        assert(dealerAppoints.length === 0,'Appointment was not removed from dealer pending appointments');
    });
});
