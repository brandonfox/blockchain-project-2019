const fs = require('fs');
const HDWalletProvider = require('@truffle/hdwallet-provider');

const secrets = JSON.parse(
  fs
    .readFileSync('.secrets')
    .toString()
    .trim()
);

module.exports = {
  networks: {
    rinkeby: {
      provider: () =>
        new HDWalletProvider(
          secrets.seed,
          `https://rinkeby.infura.io/v3/${secrets.projectId}`
        ),
      network_id: 4,
      gas: 8000000,
    },
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
