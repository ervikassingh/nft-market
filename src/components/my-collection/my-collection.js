import React, { Component } from 'react';
import ImageContract from '../../abis/ImageContract.json';
import TokenSaleContract from '../../abis/TokenSaleContract.json';

import {
    Link
} from "react-router-dom";

class MyCollection extends Component {

    render() {
        return (
            <div>
                <div className="head-title col-auto mx-4">
                    <h4 className="mb-0 font-weight-normal">My Collection</h4>
                </div>
                <div className="container-fluid mb-5 my-collect-adj">
                    <div className="row justify-content-around">
                        {this.state.images.map((id, key) => {
                            return (
                                (this.state.owners[key] === this.state.account) ?
                                    (

                                        <div key={key} className="col-3 card bg-light p-0 m-3">
                                            <Link to={{
                                                pathname: `/nft-detail/${key}`,
                                                // state: {name: "vikas"}
                                            }}>
                                                <div className="col-auto max-250">
                                                    <img alt="token" className="token" src={localStorage.getItem(this.state.imageData_name[key])} />
                                                </div>
                                                <div className="m-2">{"Name - " + this.state.imageData_name[key]}</div>
                                                <div className="m-2">{"Price - " + this.state.imageData_price[key]}
                                                <img alt="main" className="eth-class" src="../ebizcoin.png" />
                                                </div>
                                                <div className="m-2">{"Price - " + (this.state.imageData_price[key] * this.state.token_price)}
                                                <img alt="main" className="eth-class" src="../eth-logo.png" />
                                                </div>
                                            </Link>
                                        </div>

                                    )
                                    : null
                            )
                        })
                        }
                    </div>
                </div>
            </div>
        )
    }

    constructor(props) {
        super(props)
        this.state = {
            account: '',
            contract: null,
            totalSupply: 0,
            images: [],
            owners: [],
            imageData_name: [],
            imageData_price: [],
            token_sale_contract: null,
            token_price: 0
        }
    }

    async componentWillMount() {
        await this.loadBlockchainData()
    }

    async loadBlockchainData() {
        const web3 = window.web3
        // Load account
        const accounts = await web3.eth.getAccounts()
        this.setState({ account: accounts[0] })

        const networkId = await web3.eth.net.getId()
        const networkData = ImageContract.networks[networkId]
        if (networkData) {
            const abi = ImageContract.abi
            const address = networkData.address
            const contract = new web3.eth.Contract(abi, address)
            // console.log(contract)
            this.setState({ contract })
            const totalSupply = await contract.methods.totalSupply().call()
            // console.log(totalSupply)
            this.setState({ totalSupply })


            // Load NFTs
            for (var i = 1; i <= totalSupply; i++) {
                const id = await contract.methods.images(i - 1).call()
                // console.log(id)
                this.setState({
                    images: [...this.state.images, id]
                })
            }
            // Load Owner
            for (i = 1; i <= totalSupply; i++) {
                const owner = await contract.methods.ownerOf(i - 1).call()
                // console.log(owner)
                this.setState({
                    owners: [...this.state.owners, owner]
                })
            }
            // Load NFTs Data 
            for (i = 1; i <= totalSupply; i++) {
                const metadata = await contract.methods.imageData(i - 1).call()
                // console.log(metadata)
                this.setState({
                    imageData_name: [...this.state.imageData_name, metadata.name],
                    imageData_price: [...this.state.imageData_price, metadata.price]
                })
            }

        } else {
            window.alert('Smart contract not deployed to detected network.')
        }

        const sale_networkData = TokenSaleContract.networks[networkId]
        if (sale_networkData) {
            const abi = TokenSaleContract.abi
            const address = sale_networkData.address
            const token_sale_contract = new web3.eth.Contract(abi, address)
            this.setState({ token_sale_contract })
            // console.log(token_sale_contract)

            var token_price = await this.state.token_sale_contract.methods.tokenPrice().call();
            this.setState({ token_price: web3.utils.fromWei(token_price, "ether") })

        } else {
            window.alert('Smart contract not deployed to detected network.')
        }
    }

}
export default MyCollection;