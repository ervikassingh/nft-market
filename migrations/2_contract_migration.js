const ImageContract = artifacts.require("ImageContract");
const ImageSaleContract = artifacts.require("ImageSaleContract");
const TokenContract = artifacts.require("TokenContract");
const TokenSaleContract = artifacts.require("TokenSaleContract");

module.exports = async function (deployer) {
  deployer.deploy(ImageContract).then(function() {
    return deployer.deploy(ImageSaleContract, ImageContract.address);
  });

  deployer.deploy(TokenContract).then(function() {
    var tokenPrice = 1000000000000000;  // Token price is 0.001 Ether
    var tokenContractAddress = TokenContract.address;
    return deployer.deploy(TokenSaleContract, tokenContractAddress, tokenPrice);
  });

};
