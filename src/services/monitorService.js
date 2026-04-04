import api from './api';

export const monitorService = {
  // Monitor transaction on backend
  async monitorTransaction(txHash, network) {
    try {
      const response = await api.post('/monitor/transaction', {
        txHash,
        network
      });
      return response.data;
    } catch (error) {
      console.error('Transaction monitoring failed:', error);
      throw error;
    }
  },

  // Get transaction status
  async getTransactionStatus(network, txHash) {
    try {
      const response = await api.get(`/monitor/transaction/${network}/${txHash}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get transaction status:', error);
      throw error;
    }
  },

  // Poll transaction status with callback
  async pollTransactionStatus(network, txHash, callback, interval = 5000, maxAttempts = 60) {
    let attempts = 0;
    
    const poll = async () => {
      try {
        const status = await this.getTransactionStatus(network, txHash);
        callback(status);
        
        // Stop polling if transaction is confirmed or failed
        if (status.receipt && status.receipt.status !== 'pending') {
          return;
        }
        
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, interval);
        }
      } catch (error) {
        console.error('Polling error:', error);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, interval);
        }
      }
    };
    
    poll();
  }
};
