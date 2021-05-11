const PisiSale = artifacts.require('PisiSale');
const PisiToken = artifacts.require('PisiToken');

const chai = require('./setupChai.js');
const BN = web3.utils.BN;

const expect = chai.expect;

require('dotenv').config({ path: '../.env' });

contract('Pisi Sale test', async (accounts) => {
  const [deployerAccount, recipient, anotherAccount] = accounts;

  return it('Should not have any tokens in my deployer account', async () => {
    let instance = await PisiToken.deployed();
    expect(
      instance.balanceOf(deployerAccount)
    ).to.eventually.be.a.bignumber.equal(new BN(0));
  });
});
