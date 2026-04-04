const express = require('express');
const router = express.Router();
const addressValidator = require('../services/addressValidator');
const csvParser = require('../services/csvParser');

// Validate single address
router.post('/address', async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    const result = await addressValidator.validateAddress(address);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate batch of addresses
router.post('/batch', async (req, res) => {
  try {
    const { addresses } = req.body;

    if (!addresses || !Array.isArray(addresses)) {
      return res.status(400).json({ error: 'Addresses array is required' });
    }

    const result = await addressValidator.validateBatch(addresses);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Parse and validate CSV
router.post('/csv', async (req, res) => {
  try {
    const { csvContent } = req.body;

    if (!csvContent) {
      return res.status(400).json({ error: 'CSV content is required' });
    }

    const parseResult = csvParser.parseCSV(csvContent);
    
    if (parseResult.success && parseResult.data.length > 0) {
      const addresses = parseResult.data.map(item => item.address);
      const validationResult = await addressValidator.validateBatch(addresses);
      parseResult.validation = validationResult;
    }

    const submitValidation = csvParser.validateBeforeSubmit(parseResult.data);
    parseResult.submitValidation = submitValidation;

    res.json(parseResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get CSV template
router.get('/csv/template', (req, res) => {
  try {
    const count = parseInt(req.query.count) || 5;
    const template = csvParser.generateTemplate(count);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=multisender-template.csv');
    res.send(template);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
