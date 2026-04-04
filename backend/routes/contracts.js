const express = require('express');
const router = express.Router();

// Contract addresses configuration
const contracts = {
  mainnet: {
    BSC: {
      address: process.env.BSC_CONTRACT_ADDRESS,
      explorer: 'https://bscscan.com',
      rpc: process.env.BSC_RPC_URL,
      chainId: '0x38',
      name: 'Binance Smart Chain'
    },
    Polygon: {
      address: process.env.POLYGON_CONTRACT_ADDRESS,
      explorer: 'https://polygonscan.com',
      rpc: process.env.POLYGON_RPC_URL,
      chainId: '0x89',
      name: 'Polygon'
    },
    Avalanche: {
      address: process.env.AVALANCHE_CONTRACT_ADDRESS,
      explorer: 'https://snowtrace.io',
      rpc: process.env.AVALANCHE_RPC_URL,
      chainId: '0xa86a',
      name: 'Avalanche C-Chain'
    }
  },
  testnet: {
    BSC_Testnet: {
      address: process.env.BSC_TESTNET_CONTRACT_ADDRESS,
      explorer: 'https://testnet.bscscan.com',
      rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      chainId: '0x61',
      name: 'BSC Testnet'
    },
    Polygon_Testnet: {
      address: process.env.POLYGON_TESTNET_CONTRACT_ADDRESS,
      explorer: 'https://mumbai.polygonscan.com',
      rpc: 'https://rpc-mumbai.maticvigil.com',
      chainId: '0x13881',
      name: 'Polygon Mumbai'
    },
    Avalanche_Testnet: {
      address: process.env.AVALANCHE_TESTNET_CONTRACT_ADDRESS,
      explorer: 'https://testnet.snowtrace.io',
      rpc: 'https://api.avax-test.network/ext/bc/C/rpc',
      chainId: '0xa869',
      name: 'Avalanche Fuji'
    }
  }
};

// Get all contract addresses
router.get('/', (req, res) => {
  res.json(contracts);
});

// Get contract by network
router.get('/:network', (req, res) => {
  const { network } = req.params;
  const contract = contracts.mainnet[network] || contracts.testnet[network];

  if (!contract) {
    return res.status(404).json({ error: 'Network not found' });
  }

  res.json(contract);
});

// Get fees configuration
router.get('/fees/current', (req, res) => {
  res.json({
    platformFees: process.env.PLATFORM_FEES || '0.001',
    devFees: process.env.DEV_FEES || '0.0005',
    totalFees: (parseFloat(process.env.PLATFORM_FEES || '0.001') + 
                 parseFloat(process.env.DEV_FEES || '0.0005')).toString()
  });
});

module.exports = router;
