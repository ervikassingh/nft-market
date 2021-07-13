import React, { Component } from 'react';
import Web3 from 'web3';

import {
  Link
} from "react-router-dom";


class Navbar extends Component {

  constructor(props) {
    super(props)

    this.state = {
      account: ''
    }
  }

  async componentWillMount() {
    await this.loadMetaMask()
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

  async loadMetaMask() {
    await this.loadWeb3()

    const accounts = await window.web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
  }

  render() {

    return (
      <div>
        <nav className="navbar navbar-light bg-light fixed-top rounded navbar-adj">
          <div className="d-flex mx-4">
            <Link to={{
              pathname: `/`,
            }}>
              {/* <img alt="icon" className="iconimage m-0" src="" /> */}
            </Link>
            <p className="navbar-brand m-0">NFT Marketplace</p>
          </div>

          {
            (window.loaded_web3) ?
              (
                <div className="d-flex mx-4 justify-content-between ">
                  <div className="m-1">
                    <Link to={{
                      pathname: `/explore`,
                    }}>
                      <input
                        type='submit'
                        className='btn btn-block btn-outline-light rounded-0 '
                        value="Explore"
                      />
                    </Link>
                  </div>
                  <div className="m-1">
                    <Link to={{
                      pathname: `/mint`,
                    }}>
                      <input
                        type='submit'
                        className='btn btn-block btn-outline-light rounded-0 '
                        value="Create NFT"
                      />
                    </Link>
                  </div>
                  <div className="m-1">
                    <Link to={{
                      pathname: `/mint-token`,
                    }}>
                      <input
                        type='submit'
                        className='btn btn-block btn-outline-light rounded-0 '
                        value="Get Token"
                      />
                    </Link>
                  </div>
                  <div className="m-1">
                    <Link to={{
                      pathname: `/my-collection`,
                    }}>
                      <input
                        type='submit'
                        className='btn btn-block btn-outline-light rounded-0'
                        value="My Collection"
                      />
                    </Link>
                  </div>
                  <div className="d-flex m-0">
                    <div className="">
                      {
                        <p className=" m-2">Welcome! {this.state.account}</p>
                      }
                    </div>
                    <div className="">
                      <img alt="profile" className="profile" src="../profile.png" />
                    </div>
                  </div>

                </div>
              )
              :
              (
                <button type="button" onClick={(e) => { this.loadMetaMask() }} className="btn btn-outline-light mx-4 rounded-0">Login</button>
              )
          }
          {/* <button type="button" onClick={this.metam()} className="btn btn-primary m-3">Login</button> */}
        </nav>
      </div>
    )
  }
}

export default Navbar;