import api from './api';

export const validatorService = {
  // Validate CSV content on backend
  async validateCSV(csvContent) {
    try {
      const response = await api.post('/validator/csv', { csvContent });
      return response.data;
    } catch (error) {
      console.error('CSV validation failed:', error);
      throw error;
    }
  },

  // Validate single address
  async validateAddress(address) {
    try {
      const response = await api.post('/validator/address', { address });
      return response.data;
    } catch (error) {
      console.error('Address validation failed:', error);
      throw error;
    }
  },

  // Validate batch of addresses
  async validateBatch(addresses) {
    try {
      const response = await api.post('/validator/batch', { addresses });
      return response.data;
    } catch (error) {
      console.error('Batch validation failed:', error);
      throw error;
    }
  },

  // Get CSV template download URL
  getTemplateURL(count = 5) {
    return `${api.defaults.baseURL}/validator/csv/template?count=${count}`;
  }
};
