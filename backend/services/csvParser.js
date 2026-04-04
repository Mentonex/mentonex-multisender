const { ethers } = require('ethers');

class CSVParser {
  parseCSV(csvContent) {
    const lines = csvContent.trim().split('\n');
    const results = [];
    const errors = [];

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const trimmedLine = line.trim();
      
      if (!trimmedLine) return;

      const parts = trimmedLine.split(',').map(p => p.trim());
      
      if (parts.length !== 2) {
        errors.push({
          line: lineNumber,
          content: line,
          error: 'Invalid format. Expected: address,amount'
        });
        return;
      }

      const [address, amount] = parts;

      if (!ethers.utils.isAddress(address)) {
        errors.push({
          line: lineNumber,
          content: line,
          error: 'Invalid Ethereum address'
        });
        return;
      }

      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        errors.push({
          line: lineNumber,
          content: line,
          error: 'Invalid amount. Must be a positive number'
        });
        return;
      }

      results.push({
        address: ethers.utils.getAddress(address),
        amount: parsedAmount.toString(),
        line: lineNumber
      });
    });

    const addressMap = new Map();
    const duplicates = [];
    
    results.forEach(item => {
      const addr = item.address.toLowerCase();
      if (addressMap.has(addr)) {
        duplicates.push({
          address: item.address,
          lines: [addressMap.get(addr), item.line]
        });
      } else {
        addressMap.set(addr, item.line);
      }
    });

    const totalAmount = results.reduce((sum, item) => sum + parseFloat(item.amount), 0);

    return {
      success: errors.length === 0,
      data: results,
      errors,
      duplicates,
      summary: {
        totalRecipients: results.length,
        uniqueRecipients: addressMap.size,
        totalAmount: totalAmount.toString(),
        duplicateCount: duplicates.length,
        errorCount: errors.length
      }
    };
  }

  generateTemplate(count = 5) {
    const template = [];
    template.push('# MultiSender CSV Template');
    template.push('# Format: address,amount');
    template.push('# Example:');
    
    for (let i = 0; i < count; i++) {
      const randomAddress = ethers.Wallet.createRandom().address;
      const randomAmount = (Math.random() * 10).toFixed(4);
      template.push(`${randomAddress},${randomAmount}`);
    }

    return template.join('\n');
  }

  validateBeforeSubmit(data) {
    const validation = {
      valid: true,
      warnings: [],
      errors: []
    };

    if (data.length === 0) {
      validation.valid = false;
      validation.errors.push('No recipients provided');
      return validation;
    }

    if (data.length > 500) {
      validation.warnings.push(`Large batch: ${data.length} recipients. Consider splitting into smaller batches.`);
    }

    const totalAmount = data.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    if (totalAmount > 1000000) {
      validation.warnings.push(`Very large total amount: ${totalAmount}. Please verify.`);
    }

    const uniqueAddresses = new Set(data.map(item => item.address.toLowerCase()));
    if (uniqueAddresses.size !== data.length) {
      validation.warnings.push('Duplicate addresses detected');
    }

    return validation;
  }
}

module.exports = new CSVParser();
