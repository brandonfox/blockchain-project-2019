const ServiceHandler = artifacts.require('ServiceHandler');

contract('ServiceHandler', () => {
  let serviceHandler = null;
  before(async () => {
    serviceHandler = await ServiceHandler.deployed();
  });

  it('Should add a new service', async () => {
    await serviceHandler.addService('oil');
    const services = await serviceHandler.getServices();
    assert(services[0] === 'oil');
  });

  it("Should edit the service's name", async () => {
    await serviceHandler.editServiceName('oil', 'tire');
    const services = await serviceHandler.getServices();
    assert(services[0] === 'tire');
  });

  it('Should delete a service', async () => {
    await serviceHandler.deleteService('tire');
    const services = await serviceHandler.getServices();
    assert(!services.includes('tire'));
  });
});
