let MyContract = artifacts.require("./Rastreamento.sol");

module.exports = function(deployer) {
  deployer.deploy(MyContract);
};
