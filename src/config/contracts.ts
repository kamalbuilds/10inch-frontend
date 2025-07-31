// 1inch Fusion+ Contract Configuration
// This file contains all deployed contract addresses and chain-specific configurations

export interface ChainConfig {
  id: number | string;
  name: string;
  rpcUrl: string;
  type: 'EVM' | 'APTOS' | 'SUI' | 'NEAR' | 'COSMOS' | 'TRON' | 'STELLAR' | 'TON';
  nativeToken: string;
  hashAlgorithm: 'keccak256' | 'sha256';
  contracts?: {
    htlc?: string;
    relayer?: string;
    resolver?: string;
  };
  explorer?: string;
  isTestnet?: boolean;
}

// Hash algorithm configuration for each chain
export const HASH_ALGORITHMS: Record<string, 'keccak256' | 'sha256'> = {
  // EVM chains use keccak256
  ETHEREUM: 'keccak256',
  BSC: 'keccak256',
  POLYGON: 'keccak256',
  ARBITRUM: 'keccak256',
  OPTIMISM: 'keccak256',
  AVALANCHE: 'keccak256',
  
  // Move-based chains use sha256
  APTOS: 'sha256',
  SUI: 'sha256',
  
  // Other chains (default to keccak256)
  NEAR: 'keccak256',
  COSMOS: 'keccak256',
  TRON: 'keccak256',
  STELLAR: 'keccak256',
  TON: 'keccak256',
};

// Mainnet contract deployments
export const MAINNET_CONTRACTS = {
  // Polygon Mainnet
  POLYGON: {
    htlc: '0xC8973d8f3cd4Ee6bd5358AcDbE9a4CA517BDd129',
    relayer: '0x647f1146F53a2a6F9d4fb827603b916b5E72A335',
  },
  
  // Aptos Mainnet
  APTOS: {
    htlc: '0x92ecf7c4a7ce7c79630c884bef0b06fa447ec9c1cbcd55d98183e7808478376c',
    modules: {
      fusion_htlc: true,
      fusion_relayer_v2: true,
      fusion_escrow_simple: true,
      fusion_partial_fills: true,
    }
  },
  
  // Add other deployed contracts here as they become available
  ETHEREUM: {
    htlc: process.env.NEXT_PUBLIC_ETH_HTLC_ADDRESS || '',
    relayer: process.env.NEXT_PUBLIC_ETH_RELAYER_ADDRESS || '',
  },
  
  BSC: {
    htlc: process.env.NEXT_PUBLIC_BSC_HTLC_ADDRESS || '',
    relayer: process.env.NEXT_PUBLIC_BSC_RELAYER_ADDRESS || '',
  },
};

// Complete chain configurations
export const CHAIN_CONFIGS: Record<string, ChainConfig> = {
  // EVM Chains
  ETHEREUM: {
    id: 1,
    name: 'Ethereum',
    rpcUrl: process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || 'https://eth.llamarpc.com',
    type: 'EVM',
    nativeToken: 'ETH',
    hashAlgorithm: 'keccak256',
    contracts: MAINNET_CONTRACTS.ETHEREUM,
    explorer: 'https://etherscan.io',
  },
  
  POLYGON: {
    id: 137,
    name: 'Polygon',
    rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC_URL || 'https://polygon-rpc.com',
    type: 'EVM',
    nativeToken: 'MATIC',
    hashAlgorithm: 'keccak256',
    contracts: MAINNET_CONTRACTS.POLYGON,
    explorer: 'https://polygonscan.com',
  },
  
  BSC: {
    id: 56,
    name: 'BNB Smart Chain',
    rpcUrl: process.env.NEXT_PUBLIC_BSC_RPC_URL || 'https://bsc-dataseed.binance.org',
    type: 'EVM',
    nativeToken: 'BNB',
    hashAlgorithm: 'keccak256',
    contracts: MAINNET_CONTRACTS.BSC,
    explorer: 'https://bscscan.com',
  },
  
  ARBITRUM: {
    id: 42161,
    name: 'Arbitrum',
    rpcUrl: process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc',
    type: 'EVM',
    nativeToken: 'ETH',
    hashAlgorithm: 'keccak256',
    explorer: 'https://arbiscan.io',
  },
  
  OPTIMISM: {
    id: 10,
    name: 'Optimism',
    rpcUrl: process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL || 'https://mainnet.optimism.io',
    type: 'EVM',
    nativeToken: 'ETH',
    hashAlgorithm: 'keccak256',
    explorer: 'https://optimistic.etherscan.io',
  },
  
  AVALANCHE: {
    id: 43114,
    name: 'Avalanche',
    rpcUrl: process.env.NEXT_PUBLIC_AVALANCHE_RPC_URL || 'https://api.avax.network/ext/bc/C/rpc',
    type: 'EVM',
    nativeToken: 'AVAX',
    hashAlgorithm: 'keccak256',
    explorer: 'https://snowtrace.io',
  },
  
  // Non-EVM Chains
  APTOS: {
    id: 'aptos',
    name: 'Aptos',
    rpcUrl: process.env.NEXT_PUBLIC_APTOS_RPC_URL || 'https://fullnode.mainnet.aptoslabs.com',
    type: 'APTOS',
    nativeToken: 'APT',
    hashAlgorithm: 'sha256',
    contracts: {
      htlc: MAINNET_CONTRACTS.APTOS.htlc,
    },
    explorer: 'https://explorer.aptoslabs.com',
  },
  
  SUI: {
    id: 'sui',
    name: 'Sui',
    rpcUrl: process.env.NEXT_PUBLIC_SUI_RPC_URL || 'https://fullnode.mainnet.sui.io',
    type: 'SUI',
    nativeToken: 'SUI',
    hashAlgorithm: 'sha256',
    explorer: 'https://suiexplorer.com',
  },
  
  NEAR: {
    id: 'near',
    name: 'NEAR',
    rpcUrl: process.env.NEXT_PUBLIC_NEAR_RPC_URL || 'https://rpc.mainnet.near.org',
    type: 'NEAR',
    nativeToken: 'NEAR',
    hashAlgorithm: 'keccak256',
    contracts: {
      htlc: process.env.NEXT_PUBLIC_NEAR_CONTRACT_ID || 'fusion-plus.near',
    },
    explorer: 'https://explorer.near.org',
  },
  
  // Testnets (if enabled)
  SEPOLIA: {
    id: 11155111,
    name: 'Sepolia',
    rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com',
    type: 'EVM',
    nativeToken: 'ETH',
    hashAlgorithm: 'keccak256',
    isTestnet: true,
    explorer: 'https://sepolia.etherscan.io',
  },
};

// Helper function to get chain config
export function getChainConfig(chainId: string | number): ChainConfig | undefined {
  if (typeof chainId === 'number') {
    return Object.values(CHAIN_CONFIGS).find(config => config.id === chainId);
  }
  return CHAIN_CONFIGS[chainId];
}

// Helper function to get contract address for a chain
export function getContractAddress(chain: string, contractType: 'htlc' | 'relayer' | 'resolver'): string | undefined {
  const config = CHAIN_CONFIGS[chain];
  return config?.contracts?.[contractType];
}

// Helper function to determine if chains use compatible hash algorithms
export function areHashAlgorithmsCompatible(chain1: string, chain2: string): boolean {
  const algo1 = HASH_ALGORITHMS[chain1];
  const algo2 = HASH_ALGORITHMS[chain2];
  return algo1 === algo2;
}

// Export supported chains for UI
export const SUPPORTED_CHAINS = Object.keys(CHAIN_CONFIGS).filter(
  chain => !CHAIN_CONFIGS[chain].isTestnet || process.env.NEXT_PUBLIC_ENABLE_TESTNET === 'true'
);

// Export mainnet chains only
export const MAINNET_CHAINS = Object.keys(CHAIN_CONFIGS).filter(
  chain => !CHAIN_CONFIGS[chain].isTestnet
);

// Chain ID mappings for convenience
export const CHAIN_IDS = {
  ETHEREUM: 1,
  POLYGON: 137,
  BSC: 56,
  ARBITRUM: 42161,
  OPTIMISM: 10,
  AVALANCHE: 43114,
  SEPOLIA: 11155111,
} as const;

// Atomic swap flow documentation
export const ATOMIC_SWAP_STEPS = [
  {
    step: 1,
    name: 'Create Order',
    description: 'User creates a swap order on the source chain',
    chains: ['all'],
  },
  {
    step: 2,
    name: 'Lock Funds',
    description: 'User locks funds in HTLC on source chain',
    chains: ['all'],
  },
  {
    step: 3,
    name: 'Accept Order',
    description: 'Relayer accepts the order',
    chains: ['EVM'],
  },
  {
    step: 4,
    name: 'Create Destination HTLC',
    description: 'Relayer creates HTLC on destination chain',
    chains: ['all'],
  },
  {
    step: 5,
    name: 'Reveal Secret',
    description: 'User claims funds on destination chain, revealing secret',
    chains: ['all'],
  },
  {
    step: 6,
    name: 'Complete Swap',
    description: 'Relayer claims funds on source chain using revealed secret',
    chains: ['all'],
  },
  {
    step: 7,
    name: 'Finalize',
    description: 'Order is marked as complete',
    chains: ['EVM'],
  },
];