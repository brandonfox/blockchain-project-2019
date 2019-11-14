const DealerContract = artifacts.require('DealerContract');

module.exports = function(deployer) {
  deployer.deploy(DealerContract);
};
