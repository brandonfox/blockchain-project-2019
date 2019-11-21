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

  it('Should add a subservice', async () => {
    await serviceHandler.addService('fluid');
    await serviceHandler.addSubService('fluid', 'toyota');
    const subServices = await serviceHandler.getSubServices('fluid');
    assert(subServices[0] === 'toyota');
  });

  it('Should edit a subservice', async () => {
    await serviceHandler.editSubServiceName('fluid', 'toyota', 'honda');
    const subServices = await serviceHandler.getSubServices('fluid');
    assert(subServices[0] === 'honda');
  });

  it('Should delete a subservice', async () => {
    await serviceHandler.deleteSubService('fluid', 'honda');
    const subServices = await serviceHandler.getSubServices('fluid');
    assert(!subServices.includes('honda'));
  });
});
