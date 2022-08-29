const HDWalletProvider = require('@truffle/hdwallet-provider');
const provider = new HDWalletProvider({
  privateKeys: ['7addbf129b11b53039e7b7fa9b1f348f52dbf26b4cf4aeb77e3aa82cc098ea99'],
  providerOrUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
});

module.exports = {
  networks: {
    development: {
      provider: () => provider,
      network_id: "97"
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "0.8.0", 
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
