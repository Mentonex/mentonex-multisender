import api from './api';

export const transactionService = {
  // Save transaction to database
  async saveTransaction(txData) {
    try {
      const response = await api.post('/transactions', txData);
      return response.data;
    } catch (error) {
      console.error('Failed to save transaction:', error);
      throw error;
    }
  },

  // Get user transactions by address
  async getUserTransactions(address, page = 1, limit = 20) {
    try {
      const response = await api.get(`/transactions/address/${address}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get user transactions:', error);
      throw error;
    }
  },

  // Get transaction by hash
  async getTransaction(txHash) {
    try {
      const response = await api.get(`/transactions/hash/${txHash}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get transaction:', error);
      throw error;
    }
  },

  // Get all transactions with pagination
  async getAllTransactions(page = 1, limit = 20) {
    try {
      const response = await api.get('/transactions', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get all transactions:', error);
      throw error;
    }
  }
};
