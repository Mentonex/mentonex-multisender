const express = require('express');
const router = express.Router();
const transactionMonitor = require('../services/transactionMonitor');

// Initialize monitoring for networks
transactionMonitor.initProvider('BSC', process.env.BSC_RPC_URL);
transactionMonitor.initProvider('Polygon', process.env.POLYGON_RPC_URL);
transactionMonitor.initProvider('Avalanche', process.env.AVALANCHE_RPC_URL);

// Monitor a specific transaction
router.post('/transaction', async (req, res) => {
  try {
    const { txHash, network } = req.body;

    if (!txHash || !network) {
      return res.status(400).json({ error: 'txHash and network are required' });
    }

    const result = await transactionMonitor.monitorTransaction(txHash, network);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transaction status
router.get('/transaction/:network/:txHash', async (req, res) => {
  try {
    const { network, txHash } = req.params;
    const status = await transactionMonitor.getTransactionStatus(txHash, network);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start real-time monitoring for a network
router.post('/start/:network', (req, res) => {
  try {
    const { network } = req.params;
    const { contractAddress } = req.body;

    if (!contractAddress) {
      return res.status(400).json({ error: 'contractAddress is required' });
    }

    transactionMonitor.startMonitoring(network, contractAddress);
    res.json({ message: `Monitoring started for ${network}`, contractAddress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stop monitoring for a network
router.post('/stop/:network', (req, res) => {
  try {
    const { network } = req.params;
    transactionMonitor.stopMonitoring(network);
    res.json({ message: `Monitoring stopped for ${network}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
