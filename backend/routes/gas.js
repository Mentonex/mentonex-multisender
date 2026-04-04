const express = require('express');
const router = express.Router();
const gasEstimator = require('../services/gasEstimator');

// Get current gas prices for a network
router.get('/price/:network', async (req, res) => {
  try {
    const { network } = req.params;
    const gasPrice = await gasEstimator.getGasPrice(network);
    
    if (!gasPrice) {
      return res.status(404).json({ error: 'Network not supported or unavailable' });
    }

    res.json(gasPrice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Estimate transaction cost
router.post('/estimate', async (req, res) => {
  try {
    const { network, recipientCount } = req.body;

    if (!network || !recipientCount) {
      return res.status(400).json({ error: 'Network and recipientCount are required' });
    }

    const estimate = await gasEstimator.estimateTransactionCost(network, recipientCount);
    
    if (!estimate) {
      return res.status(404).json({ error: 'Unable to estimate cost' });
    }

    res.json(estimate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get gas prices for all networks
router.get('/prices/all', async (req, res) => {
  try {
    const networks = ['BSC', 'Polygon', 'Avalanche'];
    const prices = await Promise.all(
      networks.map(network => gasEstimator.getGasPrice(network))
    );

    const result = {};
    networks.forEach((network, index) => {
      result[network] = prices[index];
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
