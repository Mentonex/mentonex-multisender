# Mentonex MultiSender Backend

Backend API and smart contract deployment infrastructure for the Mentonex MultiSender DApp.

## Features

- 🔄 Transaction tracking and history
- 📊 Analytics and statistics
- 🌐 Multi-chain support (BSC, Polygon, Avalanche)
- 🔐 Secure API with rate limiting
- 📝 MongoDB database for transaction records
- 🚀 Smart contract deployment scripts

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Ethers.js** - Blockchain interaction
- **Hardhat** - Smart contract development

## Installation

```bash
cd backend
npm install
```

## Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update the `.env` file with your configuration:
   - MongoDB connection string
   - RPC URLs for each network
   - Contract addresses
   - Private keys (for deployment only)
   - API keys for block explorers

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Transactions

- `GET /api/transactions` - Get all transactions (paginated)
- `GET /api/transactions/address/:address` - Get transactions by address
- `GET /api/transactions/hash/:txHash` - Get transaction by hash
- `POST /api/transactions` - Create new transaction record
- `PATCH /api/transactions/:txHash` - Update transaction status

### Statistics

- `GET /api/stats` - Get overall statistics
- `GET /api/stats/network/:network` - Get statistics by network
- `GET /api/stats/daily?days=30` - Get daily statistics

### Contracts

- `GET /api/contracts` - Get all contract addresses
- `GET /api/contracts/:network` - Get contract by network
- `GET /api/contracts/fees/current` - Get current fees configuration

### Health Check

- `GET /health` - Server health check

## Smart Contract Deployment

### Using Hardhat

1. Compile contracts:
```bash
npx hardhat compile
```

2. Deploy to testnet:
```bash
npx hardhat run scripts/deploy.js --network bscTestnet
```

3. Deploy to mainnet:
```bash
npx hardhat run scripts/deploy.js --network bsc
```

### Supported Networks

- BSC Mainnet (`bsc`)
- BSC Testnet (`bscTestnet`)
- Polygon Mainnet (`polygon`)
- Polygon Mumbai (`polygonMumbai`)
- Avalanche C-Chain (`avalanche`)
- Avalanche Fuji (`avalancheFuji`)

## Database Schema

### Transaction Model

```javascript
{
  txHash: String,
  from: String,
  recipients: [{
    address: String,
    amount: String
  }],
  tokenAddress: String,
  tokenSymbol: String,
  totalAmount: String,
  network: String,
  status: String,
  blockNumber: Number,
  gasUsed: String,
  timestamp: Date
}
```

## Security

- Rate limiting on API endpoints
- Helmet.js for security headers
- Environment variables for sensitive data
- Input validation and sanitization
- CORS configuration

## Monitoring

The backend includes:
- Request logging with Morgan
- Error handling middleware
- Health check endpoint
- Transaction status tracking

## License

MIT
