const PisiToken = artifacts.require('PisiToken');

const { assert } = require('chai');
const chai = require('chai');
const BN = web3.utils.BN;
const chaiBN = require('chai-bn')(BN);
chai.use(chaiBN);

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const expect = chai.expect;

require('dotenv').config({ path: '../.env' });

contract('Pisi Token test', async (accounts) => {
  const [deployerAccount, recipient, anotherAccount] = accounts;

  beforeEach(async () => {
    this.pisiToken = await PisiToken.new(process.env.INITIAL_TOKENS);
  });

  it('All tokens should be in my account', async () => {
    let instance = this.pisiToken;
    let totalSupply = await instance.totalSupply();
    expect(
      instance.balanceOf(deployerAccount)
    ).to.eventually.be.a.bignumber.equal(totalSupply);
  });

  it('Is possible to send tokens between accounts', async () => {
    const sendTokens = 1;
    let instance = this.pisiToken;
    let totalSupply = await instance.totalSupply();
    expect(
      instance.balanceOf(deployerAccount)
    ).to.eventually.be.a.bignumber.equal(totalSupply);
    expect(instance.transfer(recipient, sendTokens)).to.eventually.be.fulfilled;
    expect(
      instance.balanceOf(deployerAccount)
    ).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
    expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(
      new BN(sendTokens)
    );
  });

  it('Is not possible to send more tokens than available in total', async () => {
    let instance = this.pisiToken;
    let balanceOfDeployer = await instance.balanceOf(deployerAccount);

    expect(instance.transfer(recipient, new BN(balanceOfDeployer + 1))).to
      .eventually.be.rejected;

    expect(
      instance.balanceOf(deployerAccount)
    ).to.eventually.be.a.bignumber.equal(balanceOfDeployer);
  });
});
