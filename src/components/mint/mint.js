import React, { Component } from 'react';
import ImageContract from '../../abis/ImageContract.json';
import ImageSaleContract from '../../abis/ImageSaleContract.json';

class Mint extends Component {


    render() {

        return (
            <div>
                <div className="head-title col-auto mx-4">
                    <h4 className="mb-0 font-weight-normal">Create Token</h4>
                </div>
                <div className="container-fluid pt-5 create-mint-adj">
                    <div className="row">
                        <div className="col-12 form-wrapper px-3">
                            <div className="form-container">
                                <h3 className="mb-4">Create Image NFT</h3>
                                <form className="row text-end" onSubmit={(event) => {
                                    event.preventDefault()
                                    this.mintImage();
                                }}>
                                    <div className="col-6">
                                    <input
                                        type='file'
                                        className='form-control my-2'
                                        placeholder='Choose Image'
                                        onChange={event => this.setState({ new_image: event.target.files[0] })}
                                    />
                                    </div>
                                    <div className="col-6">
                                    <input
                                        type='text'
                                        className='form-control my-2'
                                        placeholder='Name'
                                        onChange={event => this.setState({ new_name: event.target.value })}
                                    />
                                    </div>
                                      <div className="col-6">
                                    <input
                                        type='text'
                                        className='form-control my-2'
                                        placeholder='Url'
                                        onChange={event => this.setState({ new_url: event.target.value })}
                                    />
                                    </div>
                                    <div className="col-6">
                                    <input
                                        type='text'
                                        className='form-control my-2'
                                        placeholder='Price in Ebizon Tokens'
                                        onChange={event => this.setState({ new_price: event.target.value })}
                                    />
                                    </div>
                                    <div className="col-12">
                                    <textarea
                                        type='text'
                                        className='form-control my-2'
                                        placeholder='Description'
                                        rows="3"
                                        onChange={event => this.setState({ new_des: event.target.value })}
                                    />
                                    </div>
                                    <div className="col-12">
                                    <input
                                        type='submit'
                                        className='btn btn-block btn-primary my-3 rounded-0'
                                        value='Create Image NFT'
                                    />
                                    </div>
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
            contract: null,
            sale_contract: null,
            totalSupply: 0,
            images: [],
            owners: [],
            imageData_name: [],
            imageData_price: [],
            selling_to: '',
            selling_price: null,
            new_image: new Blob(),
            new_name: '',
            new_des: '',
            new_price: '',
            new_url: ''
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


        const sale_networkData = ImageSaleContract.networks[networkId]
        if (sale_networkData) {
            const sale_abi = ImageSaleContract.abi
            const sale_address = sale_networkData.address
            const sale_contract = new web3.eth.Contract(sale_abi, sale_address)
            console.log(sale_contract)
            this.setState({ sale_contract })

        } else {
            window.alert('Smart contract not deployed to detected network.')
        }
    }


    mintImage = () => {
        let file = '';
        this.getBase64(this.state.new_image, (result) => {
            file = result;
            // console.log(file);

            this.state.contract.methods.mint(
                this.state.new_name,
                this.state.new_des,
                this.state.new_url,
                this.state.new_price
            ).send({ from: this.state.account })
                .once('receipt', (receipt) => {
                    console.log("nft created");
                });

            localStorage.setItem(this.state.new_name, file);
        });
    }

    getBase64(file, cb) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result)
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

}
export default Mint;