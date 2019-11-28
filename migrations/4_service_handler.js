const ServiceHandler = artifacts.require('ServiceHandler');

module.exports = function(deployer) {
  deployer.deploy(ServiceHandler);
};
