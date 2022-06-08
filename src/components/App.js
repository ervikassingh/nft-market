import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Home from './home/home';
import Explore from './explore/explore';
import Mint from './mint/mint';
import NftDetail from './nft-detail/nft-detail';
import MyCollection from './my-collection/my-collection';
import Navbar from './navbar/navbar';
import MintToken from './mint-token/mint-token';


class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      window.loaded_web3 = true
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
      window.loaded_web3 = true
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  render() {

    return (
      <div>

        <Router>
          <Navbar />
          <div className="container">
            <div>
              <Switch>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route path="/explore">
                  <Explore />
                </Route>
                <Route path="/mint">
                  <Mint />
                </Route>
                <Route path="/my-collection">
                  <MyCollection />
                </Route>
                <Route path="/mint-token">
                  <MintToken />
                </Route>
                <Route path="/nft-detail/:name">
                  <NftDetail />
                </Route>
              </Switch>
            </div>
          </div>
        </Router>

        <footer className="page-footer fixed-bottom bg-light rounded footer-adj">
          <p className="text-center"> </p>
        </footer>
      </div>
    );
  }
}

export default App;
