import React, { Component } from 'react';
import TokenSaleContract from '../../abis/TokenSaleContract.json';

class MintToken extends Component {

    render() {

        return (
            <div>
                <div className="head-title col-auto mx-4">
                    <h4 className="mb-0 font-weight-normal">Get Token</h4>
                </div>
                <div className="container-fluid pt-5 mint-token-adj">
                    <div className="row">
                        <div className="col-6 form-wrapper px-3">
                            <div class="form-container">
                                <h3 className="">Buy Ebizon Tokens (ETK)</h3>
                                <h6 className="">{"Tokens Available - " + this.state.tokens_available}</h6>
                                <h6 className="">{"Token Price - " + this.state.token_price}
                                <img alt="main" className="eth-class" src="../eth-logo.png" />
                                </h6>
                                <form className="d-flex py-3" onSubmit={(event) => {
                                    event.preventDefault()
                                    this.buyToken();
                                }}>
                                    <input
                                        type='text'
                                        className='form-control rounded-0 mx-1'
                                        placeholder='No. of Tokens'
                                        onChange={event => this.setState({ token_no: event.target.value })}
                                    />
                                    <input
                                        type='submit'
                                        className='btn btn-block btn-primary w-25 rounded-0 mx-1'
                                        value='Buy'
                                    />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }

    constructor(props) {
        super(props)
        this.state = {
            account: '',
            token_sale_contract: null,
            tokens_available: '',
            token_price: 0,
            token_no: 0
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
        const networkData = TokenSaleContract.networks[networkId]
        if (networkData) {
            const abi = TokenSaleContract.abi
            const address = networkData.address
            const token_sale_contract = new web3.eth.Contract(abi, address)
            this.setState({ token_sale_contract })
            console.log(token_sale_contract)

            var tokens_available = await this.state.token_sale_contract.methods.balanceTokens().call();
            this.setState({ tokens_available: web3.utils.fromWei(tokens_available, "ether") })

            var token_price = await this.state.token_sale_contract.methods.tokenPrice().call();
            this.setState({ token_price: web3.utils.fromWei(token_price, "ether") })

        } else {
            window.alert('Smart contract not deployed to detected network.')
        }
    }


    buyToken = () => {

        var buy_price = this.state.token_price * this.state.token_no;

        const web3 = window.web3
        web3.eth.sendTransaction({ to: "0x0000ADb55545be52c7DB7983cC95d177F29D3C5D", from: this.state.account, value: web3.utils.toWei(buy_price.toString(), "ether") })
            .once('receipt', (receipt) => {
                console.log("ether transfered")

                this.state.token_sale_contract.methods.buyTokens(
                    web3.utils.toWei(this.state.token_no, "ether")
                ).send({ from: this.state.account })
                    .once('receipt', (receipt) => {
                        console.log("tokens bought");
                    });
            })


    }

}
export default MintToken;