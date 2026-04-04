const { ethers } = require('ethers');
const Transaction = require('../models/Transaction');

class TransactionMonitor {
  constructor() {
    this.providers = {};
    this.listeners = new Map();
  }

  initProvider(network, rpcUrl) {
    this.providers[network] = new ethers.providers.JsonRpcProvider(rpcUrl);
  }

  async monitorTransaction(txHash, network) {
    const provider = this.providers[network];
    if (!provider) {
      throw new Error(`Provider not initialized for ${network}`);
    }

    try {
      const receipt = await provider.waitForTransaction(txHash, 1);
      
      await Transaction.findOneAndUpdate(
        { txHash },
        {
          status: receipt.status === 1 ? 'confirmed' : 'failed',
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed.toString()
        },
        { new: true }
      );

      return {
        txHash,
        status: receipt.status === 1 ? 'confirmed' : 'failed',
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error(`Error monitoring transaction ${txHash}:`, error.message);
      
      await Transaction.findOneAndUpdate(
        { txHash },
        { status: 'failed' }
      );

      return { txHash, status: 'failed', error: error.message };
    }
  }

  async getTransactionStatus(txHash, network) {
    const provider = this.providers[network];
    if (!provider) {
      throw new Error(`Provider not initialized for ${network}`);
    }

    const tx = await provider.getTransaction(txHash);
    if (!tx) {
      return { found: false };
    }

    const receipt = await provider.getTransactionReceipt(txHash);
    
    return {
      found: true,
      transaction: {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: ethers.utils.formatEther(tx.value),
        gasPrice: ethers.utils.formatUnits(tx.gasPrice, 'gwei'),
        nonce: tx.nonce,
        blockNumber: tx.blockNumber
      },
      receipt: receipt ? {
        status: receipt.status === 1 ? 'success' : 'failed',
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        effectiveGasPrice: ethers.utils.formatUnits(receipt.effectiveGasPrice, 'gwei')
      } : null
    };
  }

  startMonitoring(network, contractAddress) {
    const provider = this.providers[network];
    if (!provider) return;

    const filter = {
      address: contractAddress,
      topics: [ethers.utils.id('TransferBatch(address,address[],uint256[])')]
    };

    provider.on(filter, async (log) => {
      console.log(`New TransferBatch event on ${network}:`, log.transactionHash);
      await this.monitorTransaction(log.transactionHash, network);
    });

    this.listeners.set(network, filter);
  }

  stopMonitoring(network) {
    const provider = this.providers[network];
    const filter = this.listeners.get(network);
    
    if (provider && filter) {
      provider.removeAllListeners(filter);
      this.listeners.delete(network);
    }
  }
}

module.exports = new TransactionMonitor();
