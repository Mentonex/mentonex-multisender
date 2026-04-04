const { ethers } = require('ethers');
const axios = require('axios');

class AddressValidator {
  constructor() {
    this.blacklist = new Set();
    this.cache = new Map();
  }

  async validateAddress(address) {
    if (!ethers.utils.isAddress(address)) {
      return { valid: false, reason: 'Invalid address format' };
    }

    if (this.blacklist.has(address.toLowerCase())) {
      return { valid: false, reason: 'Address is blacklisted' };
    }

    const cached = this.cache.get(address.toLowerCase());
    if (cached && Date.now() - cached.timestamp < 3600000) {
      return cached.result;
    }

    const result = { valid: true, address, checks: {} };
    this.cache.set(address.toLowerCase(), { result, timestamp: Date.now() });
    
    return result;
  }

  async validateBatch(addresses) {
    const results = await Promise.all(
      addresses.map(addr => this.validateAddress(addr))
    );

    const valid = results.filter(r => r.valid);
    const invalid = results.filter(r => !r.valid);

    return {
      total: addresses.length,
      valid: valid.length,
      invalid: invalid.length,
      duplicates: addresses.length - new Set(addresses.map(a => a.toLowerCase())).size,
      results
    };
  }

  addToBlacklist(address) {
    this.blacklist.add(address.toLowerCase());
  }

  removeFromBlacklist(address) {
    this.blacklist.delete(address.toLowerCase());
  }
}

module.exports = new AddressValidator();
