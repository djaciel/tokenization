import React, { Component } from 'react';
import PisiToken from './contracts/PisiToken.json';
import PisiSale from './contracts/PisiSale.json';
import Kyc from './contracts/Kyc.json';
import getWeb3 from './getWeb3';

import './App.css';

class App extends Component {
  state = { loaded: false, kycAddress: '' };

  componentDidMount = async () => {
    try {
      this.web3 = await getWeb3();
      this.accounts = await this.web3.eth.getAccounts();
      this.networkId = await this.web3.eth.net.getId();

      this.pisiTokenInstance = new this.web3.eth.Contract(
        PisiToken.abi,
        PisiToken.networks[this.networkId] &&
          PisiToken.networks[this.networkId].address
      );

      this.pisiSaleInstance = new this.web3.eth.Contract(
        PisiSale.abi,
        PisiSale.networks[this.networkId] &&
          PisiSale.networks[this.networkId].address
      );

      this.kycInstance = new this.web3.eth.Contract(
        Kyc.abi,
        Kyc.networks[this.networkId] && Kyc.networks[this.networkId].address
      );

      this.setState({ loaded: true });
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  };

  handleKycWhitelisting = async () => {
    await this.kycInstance.methods.setKyc(this.state.kycAddress).send({
      from: this.accounts[0],
    });
    alert(`KYC for ${this.state.kycAddress} is completed`);
  };

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract..</div>;
    }
    return (
      <div className="App">
        <h1>Pisi Token Sale</h1>
        <p>Get your tokens today!</p>
        <h2>Kyc whitelisting</h2>
        Address to allow:{' '}
        <input
          type="text"
          name="kycAddress"
          value={this.state.kycAddress}
          onChange={this.handleInputChange}
        />
        <button type="button" onClick={this.handleKycWhitelisting}>
          Add to whitelist
        </button>
      </div>
    );
  }
}

export default App;
