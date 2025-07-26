export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI?: string;
  chainId: number;
}

export interface ChainConfig {
  id: number;
  name: string;
  network: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
  logoURI?: string;
}

export const SUPPORTED_CHAINS: ChainConfig[] = [
  {
    id: 1,
    name: "Ethereum",
    network: "ethereum",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://eth.llamarpc.com"],
    blockExplorerUrls: ["https://etherscan.io"],
    logoURI: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  },
  {
    id: 11155111,
    name: "Sepolia",
    network: "sepolia",
    nativeCurrency: {
      name: "SepoliaETH",
      symbol: "SEP",
      decimals: 18,
    },
    rpcUrls: ["https://eth-sepolia.g.alchemy.com/v2/demo"],
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
    logoURI: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  },
  {
    id: 56,
    name: "BNB Smart Chain",
    network: "bsc",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://bsc-dataseed.binance.org"],
    blockExplorerUrls: ["https://bscscan.com"],
    logoURI: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
  },
  {
    id: 137,
    name: "Polygon",
    network: "polygon",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://polygonscan.com"],
    logoURI: "https://cryptologos.cc/logos/polygon-matic-logo.png",
  },
  {
    id: 42161,
    name: "Arbitrum",
    network: "arbitrum",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://arbiscan.io"],
    logoURI: "https://cryptologos.cc/logos/arbitrum-arb-logo.png",
  },
  {
    id: 10,
    name: "Optimism",
    network: "optimism",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.optimism.io"],
    blockExplorerUrls: ["https://optimistic.etherscan.io"],
    logoURI: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png",
  },
  {
    id: 43114,
    name: "Avalanche",
    network: "avalanche",
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://snowtrace.io"],
    logoURI: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
  },
];

// Default token lists for each chain
export const DEFAULT_TOKENS: Record<number, Token[]> = {
  1: [
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      decimals: 6,
      logoURI: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
      chainId: 1,
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      decimals: 6,
      logoURI: "https://cryptologos.cc/logos/tether-usdt-logo.png",
      chainId: 1,
    },
    {
      symbol: "DAI",
      name: "Dai Stablecoin",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      decimals: 18,
      logoURI: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png",
      chainId: 1,
    },
    {
      symbol: "WETH",
      name: "Wrapped Ether",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      decimals: 18,
      logoURI: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      chainId: 1,
    },
  ],
  11155111: [
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      decimals: 6,
      logoURI: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
      chainId: 11155111,
    },
    {
      symbol: "WETH",
      name: "Wrapped Ether",
      address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
      decimals: 18,
      logoURI: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      chainId: 11155111,
    },
  ],
  56: [
    {
      symbol: "USDT",
      name: "Tether USD",
      address: "0x55d398326f99059fF775485246999027B3197955",
      decimals: 18,
      logoURI: "https://cryptologos.cc/logos/tether-usdt-logo.png",
      chainId: 56,
    },
    {
      symbol: "BUSD",
      name: "Binance USD",
      address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      decimals: 18,
      logoURI: "https://cryptologos.cc/logos/binance-usd-busd-logo.png",
      chainId: 56,
    },
    {
      symbol: "WBNB",
      name: "Wrapped BNB",
      address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      decimals: 18,
      logoURI: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
      chainId: 56,
    },
  ],
  137: [
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      decimals: 6,
      logoURI: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
      chainId: 137,
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      decimals: 6,
      logoURI: "https://cryptologos.cc/logos/tether-usdt-logo.png",
      chainId: 137,
    },
    {
      symbol: "WMATIC",
      name: "Wrapped Matic",
      address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      decimals: 18,
      logoURI: "https://cryptologos.cc/logos/polygon-matic-logo.png",
      chainId: 137,
    },
  ],
  42161: [
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
      decimals: 6,
      logoURI: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
      chainId: 42161,
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
      decimals: 6,
      logoURI: "https://cryptologos.cc/logos/tether-usdt-logo.png",
      chainId: 42161,
    },
    {
      symbol: "WETH",
      name: "Wrapped Ether",
      address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
      decimals: 18,
      logoURI: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      chainId: 42161,
    },
  ],
  10: [
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
      decimals: 6,
      logoURI: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
      chainId: 10,
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
      decimals: 6,
      logoURI: "https://cryptologos.cc/logos/tether-usdt-logo.png",
      chainId: 10,
    },
    {
      symbol: "WETH",
      name: "Wrapped Ether",
      address: "0x4200000000000000000000000000000000000006",
      decimals: 18,
      logoURI: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      chainId: 10,
    },
  ],
  43114: [
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      decimals: 6,
      logoURI: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
      chainId: 43114,
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      address: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
      decimals: 6,
      logoURI: "https://cryptologos.cc/logos/tether-usdt-logo.png",
      chainId: 43114,
    },
    {
      symbol: "WAVAX",
      name: "Wrapped AVAX",
      address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
      decimals: 18,
      logoURI: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
      chainId: 43114,
    },
  ],
};

// Non-EVM chains configuration
export const NON_EVM_CHAINS = {
  APTOS: {
    name: "Aptos",
    id: "aptos",
    logoURI: "https://cryptologos.cc/logos/aptos-apt-logo.png",
  },
  SUI: {
    name: "Sui",
    id: "sui",
    logoURI: "https://cryptologos.cc/logos/sui-sui-logo.png",
  },
  COSMOS: {
    name: "Cosmos",
    id: "cosmos",
    logoURI: "https://cryptologos.cc/logos/cosmos-atom-logo.png",
  },
  STELLAR: {
    name: "Stellar",
    id: "stellar",
    logoURI: "https://cryptologos.cc/logos/stellar-xlm-logo.png",
  },
  TRON: {
    name: "Tron",
    id: "tron",
    logoURI: "https://cryptologos.cc/logos/tron-trx-logo.png",
  },
  TON: {
    name: "TON",
    id: "ton",
    logoURI: "https://cryptologos.cc/logos/toncoin-ton-logo.png",
  },
};