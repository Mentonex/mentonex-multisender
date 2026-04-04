const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  txHash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  from: {
    type: String,
    required: true,
    index: true
  },
  recipients: [{
    address: String,
    amount: String
  }],
  tokenAddress: {
    type: String,
    default: null
  },
  tokenSymbol: {
    type: String,
    default: 'Native'
  },
  totalAmount: {
    type: String,
    required: true
  },
  network: {
    type: String,
    required: true,
    enum: ['BSC', 'Polygon', 'Avalanche', 'BSC_Testnet', 'Polygon_Testnet', 'Avalanche_Testnet']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed'],
    default: 'pending'
  },
  blockNumber: {
    type: Number
  },
  gasUsed: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
TransactionSchema.index({ from: 1, timestamp: -1 });
TransactionSchema.index({ network: 1, timestamp: -1 });
TransactionSchema.index({ status: 1, timestamp: -1 });

module.exports = mongoose.model('Transaction', TransactionSchema);
