const { ethers } = require('ethers');
const axios = require('axios');

class GasEstimator {
  constructor() {
    this.providers = {
      BSC: new ethers.providers.JsonRpcProvider(process.env.BSC_RPC_URL),
      Polygon: new ethers.providers.JsonRpcProvider(process.env.POLYGON_RPC_URL),
      Avalanche: new ethers.providers.JsonRpcProvider(process.env.AVALANCHE_RPC_URL)
    };
  }

  async getGasPrice(network) {
    try {
      const provider = this.providers[network];
      if (!provider) throw new Error('Unsupported network');

      const gasPrice = await provider.getGasPrice();
      const gasPriceGwei = ethers.utils.formatUnits(gasPrice, 'gwei');

      return {
        network,
        standard: parseFloat(gasPriceGwei),
        fast: parseFloat(gasPriceGwei) * 1.2,
        instant: parseFloat(gasPriceGwei) * 1.5,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Gas price error for ${network}:`, error.message);
      return null;
    }
  }

  async estimateTransactionCost(network, recipientCount) {
    const gasPrice = await this.getGasPrice(network);
    if (!gasPrice) return null;

    const baseGas = 50000;
    const gasPerRecipient = 25000;
    const estimatedGas = baseGas + (gasPerRecipient * recipientCount);

    const costInGwei = estimatedGas * gasPrice.standard;
    const costInEth = costInGwei / 1e9;

    return {
      network,
      recipientCount,
      estimatedGas,
      gasPriceGwei: gasPrice.standard,
      estimatedCost: {
        eth: costInEth,
        gwei: costInGwei
      }
    };
  }
}

module.exports = new GasEstimator();
