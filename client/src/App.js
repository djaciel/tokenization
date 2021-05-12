import React, { Component } from 'react';
import PisiToken from './contracts/PisiToken.json';
import PisiSale from './contracts/PisiSale.json';
import Kyc from './contracts/Kyc.json';
import getWeb3 from './getWeb3';

import './App.css';

class App extends Component {
  state = { loaded: false };

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

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  }
}

export default App;
