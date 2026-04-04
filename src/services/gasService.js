import api from './api';

export const gasService = {
  // Get current gas price for a specific network
  async getGasPrice(network) {
    try {
      const response = await api.get(`/gas/price/${network}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch gas price:', error);
      throw error;
    }
  },

  // Estimate transaction cost
  async estimateCost(network, recipientCount) {
    try {
      const response = await api.post('/gas/estimate', {
        network,
        recipientCount
      });
      return response.data;
    } catch (error) {
      console.error('Failed to estimate cost:', error);
      throw error;
    }
  },

  // Get gas prices for all networks
  async getAllGasPrices() {
    try {
      const response = await api.get('/gas/prices/all');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch all gas prices:', error);
      throw error;
    }
  }
};
