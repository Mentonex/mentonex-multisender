// Convert chain ID to network name for backend API
export const getNetworkName = (chainId) => {
  const chainIdNum = typeof chainId === 'string' ? parseInt(chainId, 16) : chainId;
  
  switch (chainIdNum) {
    case 56:    // 0x38
    case 97:    // 0x61
      return 'BSC';
    case 137:   // 0x89
    case 80001: // 0x13881
      return 'Polygon';
    case 43114: // 0xa86a
    case 43113: // 0xa869
      return 'Avalanche';
    default:
      return 'Unknown';
  }
};

// Get network display name
export const getNetworkDisplayName = (chainId) => {
  const chainIdNum = typeof chainId === 'string' ? parseInt(chainId, 16) : chainId;
  
  switch (chainIdNum) {
    case 56:
      return 'BSC Mainnet';
    case 97:
      return 'BSC Testnet';
    case 137:
      return 'Polygon Mainnet';
    case 80001:
      return 'Polygon Mumbai';
    case 43114:
      return 'Avalanche Mainnet';
    case 43113:
      return 'Avalanche Fuji';
    default:
      return 'Unknown Network';
  }
};

// Check if network is supported
export const isSupportedNetwork = (chainId) => {
  const chainIdNum = typeof chainId === 'string' ? parseInt(chainId, 16) : chainId;
  return [56, 97, 137, 80001, 43114, 43113].includes(chainIdNum);
};
