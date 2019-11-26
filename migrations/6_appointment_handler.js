const AppointmentHandler = artifacts.require('AppointmentHandler');

module.exports = function(deployer) {
  deployer.deploy(AppointmentHandler);
};