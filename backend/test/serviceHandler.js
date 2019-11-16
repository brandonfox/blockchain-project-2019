const ServiceHandler = artifacts.require('ServiceHandler');

contract('ServiceHandler', () => {
  let serviceHandler = null;
  before(async () => {
    serviceHandler = await ServiceHandler.deployed();
  });

  it('Should add a new service', async () => {
    await serviceHandler.addService('oil');
    const services = await serviceHandler.getServices();
    console.log('services', services);
    assert(services[0] === 'oil');
  });
});
