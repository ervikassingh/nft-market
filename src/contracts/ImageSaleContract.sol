pragma solidity >0.5.0;

import "./ImageContract.sol";

contract ImageSaleContract {

    address admin;
    ImageContract public imageContract;

    event BoughtNFT(uint256 _tokenId, address _buyer, uint256 _price);

    constructor(ImageContract _imageContract) public {
        admin = address(this);
        imageContract = _imageContract;
    }

    function buyImage(address _owner, uint256 _tokenId, uint256 _price) public payable {
        imageContract.transferFrom(_owner, msg.sender, _tokenId);
        imageContract.nftSold(_tokenId);
        emit BoughtNFT(_tokenId, msg.sender, _price);
    }

    function bid(address _owner, uint256 _tokenId, uint256 _price) public payable {
        imageContract.transferFrom(_owner, msg.sender, _tokenId);
        imageContract.nftSold(_tokenId);
        emit BoughtNFT(_tokenId, msg.sender, _price);
    }

}