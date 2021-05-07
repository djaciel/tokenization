const PisiToken = artifacts.require('PisiToken.sol');

module.exports = async function (deployer) {
  await deployer.deploy(PisiToken, 10032019);
};
