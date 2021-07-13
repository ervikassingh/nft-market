import React, { Component } from 'react';
import ImageContract from '../../abis/ImageContract.json';
import ImageSaleContract from '../../abis/ImageSaleContract.json';
import TokenContract from '../../abis/TokenContract.json';
import TokenSaleContract from '../../abis/TokenSaleContract.json';

class Mint extends Component {

    render() {

        const nft_id_path = window.location.pathname.split('/')
        const key = nft_id_path[nft_id_path.length - 1]
        // console.log(key)

        return (
            <div>
                <div className="head-title col-auto mx-4">
                    <h4 className="mb-0 font-weight-normal">NFT Detail</h4>
                </div>
                <div className="nft-detail-adj">
                    <div className="d-flex justify-content-around">
                        <div className="col-4">
                            <div className="max-300">
                                <img alt="main" className="homeimage shadow-lg rounded" src={localStorage.getItem(this.state.imageData_name[key])} />
                            </div>
                        </div>

                        <div className="col-8">
                            <div className="table-adj">
                                <div className="table-responsive">
                                    <table className="table table-sm table-borderless table-hover">
                                        <tbody className="">
                                            <tr>
                                                <th className="pl-0 w-40" scope="row"><strong>Name</strong></th>
                                                <td>{this.state.imageData_name[key]}</td>
                                            </tr>
                                            <tr>
                                                <th className="pl-0 w-40" scope="row"><strong>Owner</strong></th>
                                                {/* <td>{this.state.owners[key]}</td> */}
                                                <td>{
                                                    this.state.owners[key]
                                                }</td>
                                            </tr>
                                            <tr>
                                                <th className="pl-0 w-40" scope="row"><strong>Url</strong></th>
                                                <td>{this.state.imageData_url[key]}</td>
                                            </tr>
                                            <tr>
                                                <th className="pl-0 w-40" scope="row"><strong>Description</strong></th>
                                                <td>{this.state.imageData_des[key]}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="d-flex justify-content-center align-items-center my-1">
                                {
                                    (!this.state.approved[key] && (this.state.owners[key] === this.state.account)) ?
                                        (
                                            <form onSubmit={(event) => {
                                                event.preventDefault()
                                                this.approveNFT(key);
                                            }}>
                                                <div className="d-flex">
                                                    <div className="w-75 my-1">Price in ETK -</div>
                                                    <input
                                                        type='text'
                                                        className='form-control mx-1'
                                                        placeholder='New Price in ETK'
                                                        defaultValue={this.state.imageData_price[key]}
                                                        onChange={event => this.setState({ new_price: event.target.value })}
                                                    />
                                                    <input
                                                        type='submit'
                                                        className='btn btn-block btn-primary rounded-0 mx-1'
                                                        value={"Approve for Sale"}
                                                    />
                                                </div>
                                            </form>
                                        )
                                        : null
                                }
                            </div>

                            <div className="d-flex justify-content-center align-items-center">
                                <div className="mx-2">
                                    {
                                        (this.state.approved[key] && (this.state.owners[key] !== this.state.account)) ?
                                            (
                                                <form onSubmit={(event) => {
                                                    event.preventDefault()
                                                    this.buyEtk(key);
                                                }}>
                                                    {/* <input
                                                type='submit'
                                                className='btn btn-block btn-primary rounded-0'
                                                value={"Buy - " + this.state.imageData_price[key] + " ETK"}
                                            /> */}
                                                    <button type="submit" className='btn btn-block btn-primary rounded-0 text-dark'>
                                                        {"Buy - " + this.state.imageData_price[key]}
                                                        <img alt="main" className="eth-class" src="../ebizcoin.png" />
                                                    </button>
                                                </form>
                                            )
                                            : null
                                    }
                                </div>

                                <div className="mx-2">
                                    {
                                        (this.state.approved[key] && (this.state.owners[key] !== this.state.account)) ?
                                            (
                                                <form onSubmit={(event) => {
                                                    event.preventDefault()
                                                    this.buyEth(key);
                                                }}>
                                                    {/* <input
                                                type='submit'
                                                className='btn btn-block btn-primary rounded-0'
                                                value={"Buy - " + (this.state.imageData_price[key] * this.state.token_price) + " ETH"}
                                            /> */}
                                                    <button type="submit" className='btn btn-block btn-primary rounded-0 text-dark'>
                                                        {"Buy - " + (this.state.imageData_price[key] * this.state.token_price)}
                                                        <img alt="main" className="eth-class" src="../eth-logo.png" />
                                                    </button>
                                                </form>
                                            )
                                            : null
                                    }
                                </div>
                            </div>

                            <div className="d-flex justify-content-center align-items-center my-1">
                                {
                                    (!this.state.approved[key] && (this.state.owners[key] !== this.state.account)) ?
                                        (
                                            <div className="text-danger">{"This NFT is not Approved by Owner"}</div>
                                        )
                                        : null
                                }
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h5>Transactions</h5>
                        <table className="table table-sm table-borderless">
                            <thead>
                                <tr>
                                    <th>Buyer</th>
                                    <th>Price in ETK</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.transactions.slice(0).reverse().map((transaction, i) => {
                                    return (
                                        (transaction._tokenId === key) ?
                                            (
                                                <tr key={i}>
                                                    <td>{transaction._buyer}</td>
                                                    <td>{transaction._price}</td>
                                                </tr>
                                            ) : null
                                    )
                                })
                                }
                            </tbody>
                        </table>
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
            sale_contract: null,
            token_contract: null,
            token_sale_contract: null,
            totalSupply: 0,
            token_price: 0,
            images: [],
            owners: [],
            imageData_name: [],
            imageData_price: [],
            imageData_des: [],
            imageData_url: [],
            selling_to: '',
            selling_price: null,
            approved: [],
            new_price: null,
            transactions: []
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
            console.log(contract)
            // console.log(await contract.getPastEvents('Transfer', { fromBlock: 0, toBlock: 'latest' }))

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
                    imageData_price: [...this.state.imageData_price, metadata.price],
                    imageData_des: [...this.state.imageData_des, metadata.description],
                    imageData_url: [...this.state.imageData_url, metadata.url]
                })
            }

        } else {
            window.alert('Smart contract not deployed to detected network.')
        }

        const sale_networkData = ImageSaleContract.networks[networkId]
        if (sale_networkData) {
            const sale_abi = ImageSaleContract.abi
            const sale_address = sale_networkData.address
            const sale_contract = new web3.eth.Contract(sale_abi, sale_address)
            this.setState({ sale_contract })

            // console.log(sale_contract)
            const transactions = await sale_contract.getPastEvents('BoughtNFT', { fromBlock: 0, toBlock: 'latest' })
            // console.log(transactions)

            for (i = 0; i < transactions.length; i++) {
                this.setState({ transactions: [...this.state.transactions, transactions[i].returnValues] })
            }

            for (i = 1; i <= this.state.totalSupply; i++) {

                var approv = await this.state.contract.methods.isApprovedOrOwner(this.state.sale_contract._address, (i - 1)).call();
                this.setState({ approved: [...this.state.approved, approv] })

                // console.log(approv);
            }

        } else {
            window.alert('Smart contract not deployed to detected network.')
        }

        const token_networkData = TokenContract.networks[networkId]
        if (token_networkData) {
            const abi = TokenContract.abi
            const address = token_networkData.address
            const token_contract = new web3.eth.Contract(abi, address)
            this.setState({ token_contract })
            // console.log(await token_contract.methods.totalSupply().call())

        } else {
            window.alert('Smart contract not deployed to detected network.')
        }

        const token_sale_networkData = TokenSaleContract.networks[networkId]
        if (token_sale_networkData) {
            const abi = TokenSaleContract.abi
            const address = token_sale_networkData.address
            const token_sale_contract = new web3.eth.Contract(abi, address)
            this.setState({ token_sale_contract })
            // console.log(token_sale_contract)

            var token_price = await this.state.token_sale_contract.methods.tokenPrice().call();
            this.setState({ token_price: web3.utils.fromWei(token_price, "ether") })

        } else {
            window.alert('Smart contract not deployed to detected network.')
        }

    }


    buyEth = (key) => {
        const web3 = window.web3
        web3.eth.sendTransaction({ to: this.state.owners[key], from: this.state.account, value: web3.utils.toWei(this.state.imageData_price[key], "ether") * this.state.token_price })
            .once('receipt', (receipt) => {
                console.log("ether transfered")

                this.state.sale_contract.methods.buyImage(this.state.owners[key], key, this.state.imageData_price[key]).send({ from: this.state.account })
                    .once('receipt', (receipt) => {
                        console.log("nft bought")
                    })
            })


    }

    buyEtk = (key) => {
        const web3 = window.web3
        this.state.token_contract.methods.transfer(
            this.state.owners[key],
            web3.utils.toWei(this.state.imageData_price[key], "ether")
        ).send({ from: this.state.account, })
            .once('receipt', (receipt) => {
                console.log("tokens transfered")

                this.state.sale_contract.methods.buyImage(this.state.owners[key], key, this.state.imageData_price[key]).send({ from: this.state.account })
                    .once('receipt', (receipt) => {
                        console.log("nft bought")
                    })
            })

    }

    approveNFT = (key) => {

        if (this.state.new_price == null) {
            this.setState({ new_price: this.state.imageData_price[key] });
        }

        this.state.contract.methods.updatePrice(
            key, this.state.new_price
        ).send({ from: this.state.account })
            .once('receipt', (receipt) => {
                console.log("price updated");

                this.state.contract.methods.approveNFT(
                    this.state.sale_contract._address, key
                ).send({ from: this.state.account })
                    .once('receipt', (receipt) => {
                        console.log("nft approved for sale");
                    });
            });

    }

}
export default Mint;