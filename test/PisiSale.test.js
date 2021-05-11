const PisiSale = artifacts.require('PisiSale');
const PisiToken = artifacts.require('PisiToken');
const Kyc = artifacts.require('Kyc');

const chai = require('./setupChai.js');
const BN = web3.utils.BN;

const expect = chai.expect;

require('dotenv').config({ path: '../.env' });

contract('Pisi Sale test', async (accounts) => {
  const [deployerAccount, recipient, anotherAccount] = accounts;

  it('Should not have any tokens in my deployer account', async () => {
    let instance = await PisiToken.deployed();
    return expect(
      instance.balanceOf(deployerAccount)
    ).to.eventually.be.a.bignumber.equal(new BN(0));
  });

  it('All tokens should be in the TokenSale Smart Contract by default', async () => {
    let instance = await PisiToken.deployed();
    let balanceOfTokenSale = await instance.balanceOf(PisiSale.address);
    let totalSupply = await instance.totalSupply();
    return expect(balanceOfTokenSale).to.be.a.bignumber.equal(totalSupply);
  });

  it('Should be possible to buy tokens', async () => {
    let tokenInstance = await PisiToken.deployed();
    let tokenSaleInstance = await PisiSale.deployed();
    let kycInstance = await Kyc.deployed();
    let balanceBefore = await tokenInstance.balanceOf(deployerAccount);
    await kycInstance.setKyc(deployerAccount, { from: deployerAccount });
    expect(
      tokenSaleInstance.sendTransaction({
        from: deployerAccount,
        value: web3.utils.toWei('1', 'wei'),
      })
    ).to.be.fulfilled;
    balanceBefore = balanceBefore.add(new BN(1));
    return expect(
      tokenInstance.balanceOf(deployerAccount)
    ).to.eventually.be.a.bignumber.equal(balanceBefore);
  });
});
