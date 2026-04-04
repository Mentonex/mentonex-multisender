const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Load contract ABI and bytecode
const contractPath = path.join(__dirname, '../../contract/MultiSender.sol');
const contractSource = fs.readFileSync(contractPath, 'utf8');

async function deployContract(network) {
  console.log(`\n🚀 Deploying to ${network}...`);

  // Network configuration
  const networks = {
    bsc: {
      rpc: process.env.BSC_RPC_URL,
      chainId: 56
    },
    bscTestnet: {
      rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      chainId: 97
    },
    polygon: {
      rpc: process.env.POLYGON_RPC_URL,
      chainId: 137
    },
    polygonTestnet: {
      rpc: 'https://rpc-mumbai.maticvigil.com',
      chainId: 80001
    },
    avalanche: {
      rpc: process.env.AVALANCHE_RPC_URL,
      chainId: 43114
    },
    avalancheTestnet: {
      rpc: 'https://api.avax-test.network/ext/bc/C/rpc',
      chainId: 43113
    }
  };

  const config = networks[network];
  if (!config) {
    throw new Error(`Unknown network: ${network}`);
  }

  // Setup provider and wallet
  const provider = new ethers.providers.JsonRpcProvider(config.rpc);
  const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);

  console.log(`📝 Deployer address: ${wallet.address}`);

  // Get balance
  const balance = await wallet.getBalance();
  console.log(`💰 Balance: ${ethers.utils.formatEther(balance)} ${network.includes('bsc') ? 'BNB' : network.includes('polygon') ? 'MATIC' : 'AVAX'}`);

  // Deploy parameters
  const platformFees = ethers.utils.parseEther(process.env.PLATFORM_FEES || '0.001');
  const devFees = ethers.utils.parseEther(process.env.DEV_FEES || '0.0005');
  const platformWallet = process.env.PLATFORM_WALLET;
  const devWallet = process.env.DEV_WALLET;
  const owner = wallet.address;

  console.log(`\n📋 Deployment Parameters:`);
  console.log(`   Platform Fees: ${ethers.utils.formatEther(platformFees)}`);
  console.log(`   Dev Fees: ${ethers.utils.formatEther(devFees)}`);
  console.log(`   Platform Wallet: ${platformWallet}`);
  console.log(`   Dev Wallet: ${devWallet}`);
  console.log(`   Owner: ${owner}`);

  // Note: You need to compile the contract first using Hardhat or another tool
  // This is a deployment script template
  console.log(`\n⚠️  Please compile the contract first using Hardhat`);
  console.log(`   Run: npx hardhat compile`);
  console.log(`   Then use: npx hardhat run scripts/deploy.js --network ${network}`);
}

// Main execution
const network = process.argv[2] || 'bscTestnet';
deployContract(network)
  .then(() => {
    console.log('\n✅ Deployment script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Deployment failed:', error);
    process.exit(1);
  });
