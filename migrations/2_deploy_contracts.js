const PisiToken = artifacts.require('PisiToken.sol');
const PisiSale = artifacts.require('PisiSale.sol');

module.exports = async function (deployer) {
  const accounts = await web3.eth.getAccounts();

  await deployer.deploy(PisiToken, 10032019);
  await deployer.deploy(PisiSale, 1, accounts[0], PisiToken.address);
  const instance = await PisiToken.deployed();
  instance.transfer(PisiSale.address, 10032019);
};
