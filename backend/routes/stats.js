const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Get overall statistics
router.get('/', async (req, res) => {
  try {
    const totalTransactions = await Transaction.countDocuments();
    const totalUsers = await Transaction.distinct('from').then(arr => arr.length);
    
    const totalVolume = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $toDouble: '$totalAmount' } }
        }
      }
    ]);

    const networkStats = await Transaction.aggregate([
      {
        $group: {
          _id: '$network',
          count: { $sum: 1 },
          volume: { $sum: { $toDouble: '$totalAmount' } }
        }
      }
    ]);

    const recentTransactions = await Transaction.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .select('txHash from network totalAmount timestamp status');

    res.json({
      totalTransactions,
      totalUsers,
      totalVolume: totalVolume[0]?.total || 0,
      networkStats,
      recentTransactions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get statistics by network
router.get('/network/:network', async (req, res) => {
  try {
    const { network } = req.params;
    
    const stats = await Transaction.aggregate([
      { $match: { network } },
      {
        $group: {
          _id: null,
          totalTransactions: { $sum: 1 },
          totalVolume: { $sum: { $toDouble: '$totalAmount' } },
          uniqueUsers: { $addToSet: '$from' }
        }
      },
      {
        $project: {
          totalTransactions: 1,
          totalVolume: 1,
          uniqueUsers: { $size: '$uniqueUsers' }
        }
      }
    ]);

    res.json(stats[0] || { totalTransactions: 0, totalVolume: 0, uniqueUsers: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get daily statistics
router.get('/daily', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const dailyStats = await Transaction.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          count: { $sum: 1 },
          volume: { $sum: { $toDouble: '$totalAmount' } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(dailyStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
