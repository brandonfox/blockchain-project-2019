const NotificationHandler = artifacts.require('NotificationHandler');

module.exports = function(deployer) {
  deployer.deploy(NotificationHandler);
};
