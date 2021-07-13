pragma solidity >0.5.0;

import "../openzeppelin/token/ERC721/extensions/ERC721Full.sol";
import "../openzeppelin/token/ERC721/extensions/IERC721Metadata.sol";

contract ImageContract is IERC721Metadata, ERC721Full{

  struct metadata { 
  string name;
  string description;
  string url;
  uint price;
  }

  string[] public images;
  mapping(uint => metadata) public imageData;
  mapping(string => bool) _imageExists;

  mapping(uint => bool) _listedForAuction;
  mapping(uint => bool) _listedForSale;


  struct auctionData { 
  uint price;
  uint time;
  }
  mapping(uint => auctionData) tokenAuction;


  constructor() ERC721("Image_NFT", "IMG") public {}

  function mint(string memory _name, string memory _description, string memory _url, uint _price) public returns (uint){
    require(!_imageExists[_url]);

    metadata memory md;
    md.name = _name;
    md.description = _description;
    md.url = _url;
    md.price = _price;
    
    images.push(_url);
    uint _id = images.length -1;
    imageData[_id] = md;
    _mint(msg.sender, _id);
    _imageExists[_url] = true;

    return _id;
  }

  function approveNFT(address _to, uint _tokenId) public {
    approve(_to, _tokenId);
  }
  
  function isApprovedOrOwner(address _address, uint _tokenId) public returns (bool){
    return _isApprovedOrOwner(_address, _tokenId);
  }

  function updatePrice(uint _id, uint _price) public returns (bool){
    require(ownerOf(_id) == msg.sender);
    imageData[_id].price = _price;

    return true;
  }

  function approveForSale(address _to, uint _tokenId, uint _price) public {
    require(_listedForAuction[_tokenId] == false);
    _listedForSale[_tokenId] = true;
    updatePrice(_tokenId, _price);
    approveNFT(_to, _tokenId);
  }

  function approveForAuction(address _to, uint _tokenId, uint _price, uint _time) public {
    require(_listedForSale[_tokenId] == false);
    _listedForAuction[_tokenId] = true;
    // updatePrice(_tokenId, _price);
    approveNFT(_to, _tokenId);

    auctionData memory ad;
    ad.price = _price;
    ad.time = _time;

    tokenAuction[_tokenId] = ad;
  }

  function nftSold(uint _tokenId) public {
    _listedForSale[_tokenId] = false;
    _listedForAuction[_tokenId] = false;
  }

}