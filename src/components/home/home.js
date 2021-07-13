import React from 'react';
import { useHistory } from 'react-router-dom';

const Home = () => {
    window.loaded_web3 = false;

    const history = useHistory();
    const handleClick1 = () => {
        history.push('/explore');
    }
    const handleClick2 = () => {
        history.push('/mint');
    }

    return (

        <div>
        <div className="head-title col-auto mx-4">
            <h4 className="mb-0 font-weight-normal">Home</h4>
        </div>
        <div className="row home-adj">
            <div className="col-sm-4">
            <div className="card shadow-sm">
                <div className="max-300">
                    <img alt="home" className="homeimage rounded-top" src={localStorage.getItem("new_nft_1")} />
                </div>
                <div className="text-title">Featured NFT</div>
            </div>
            </div>

            <div className="col-sm-8 wrapper">
                <div className="heading-container">
                    <h2>Welcome to NFT Marketplace</h2>
                    <p className="text-secondary" style={{ fontSize: '18px',lineHeight:2,wordSpacing:2}}>
                        Here you can buy and sell NFTs. As word spreads about the rise of Non-Fungible Tokens (NFTs), we’re fielding more and more questions from artists and creators looking to sell their work on the blockchain. Here’s how to turn your art into NFTs and list them for sale.
                    </p>
                </div>
            <div className="d-flex justify-content-end align-items-center align-self-end">
                <button type="button" onClick={handleClick1} className="btn btn-primary rounded-0 m-3">Explore NFTs</button>
                <button type="button" onClick={handleClick2} className="btn btn-primary rounded-0 m-3">Create NFTs</button>
            </div>
            </div>
            
        </div>
        </div>
    )
};

export default Home;
