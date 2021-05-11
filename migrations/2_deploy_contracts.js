const PisiToken = artifacts.require('PisiToken.sol');
const Kyc = artifacts.require('Kyc.sol');
const PisiSale = artifacts.require('PisiSale.sol');
require('dotenv').config({ path: '../.env' });

module.exports = async function (deployer) {
  const accounts = await web3.eth.getAccounts();

  await deployer.deploy(PisiToken, process.env.INITIAL_TOKENS);
  await deployer.deploy(Kyc);
  await deployer.deploy(
    PisiSale,
    1,
    accounts[0],
    PisiToken.address,
    Kyc.address
  );

  const instance = await PisiToken.deployed();
  instance.transfer(PisiSale.address, process.env.INITIAL_TOKENS);
};
