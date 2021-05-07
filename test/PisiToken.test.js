const PisiToken = artifacts.require('PisiToken');

const { assert } = require('chai');
const chai = require('chai');
const BN = web3.utils.BN;
const chaiBN = require('chai-bn')(BN);
chai.use(chaiBN);

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const expect = chai.expect;

contract('Pisi Token test', async (accounts) => {
  it('All tokens should be in my account', async () => {
    let instance = await PisiToken.deployed();
    let totalSupply = await instance.totalSupply();
    // let balance = await instance.balanceOf(accounts[0]);
    // assert.equal(
    //   balance.valueOf(),
    //   initialSupply.valueOf(),
    //   'The balance was not the same'
    // );
    expect(await instance.balanceOf(accounts[0])).to.be.a.bignumber.equal(
      totalSupply
    );
  });
});
