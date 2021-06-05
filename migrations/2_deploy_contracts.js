const Arbitrage = artifacts.require('Arbitrage.sol');
require('dotenv').config({ path: '../.env' });

module.exports = async function (deployer) {
  const accounts = await web3.eth.getAccounts();

  await deployer.deploy(Arbitrage);
  //await deployer.deploy(PisiToken, process.env.INITIAL_TOKENS);
  //await deployer.deploy(Exchange);
  //await deployer.deploy(Kyc);
  // await deployer.deploy(
  //   PisiSale,
  //   1,
  //   accounts[0],
  //   PisiToken.address,
  //   Kyc.address
  // );

  // const instance = await PisiToken.deployed();
  // instance.transfer(PisiSale.address, process.env.INITIAL_TOKENS);
};
