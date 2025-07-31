export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI?: string;
  chainId: number | string; // Support both numeric (EVM) and string (non-EVM) chain IDs
}

export interface ChainConfig {
  id: number | string; // Support both numeric (EVM) and string (non-EVM) chain IDs
  name: string;
  network: string;
  type?: 'EVM' | 'SOLANA' | 'APTOS' | 'SUI' | 'NEAR' | 'COSMOS' | 'TRON' | 'STELLAR' | 'TON';
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
    type: "EVM",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://eth.llamarpc.com"],
    blockExplorerUrls: ["https://etherscan.io"],
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
  },
  {
    id: 11155111,
    name: "Sepolia",
    network: "sepolia",
    type: "EVM",
    nativeCurrency: {
      name: "SepoliaETH",
      symbol: "SEP",
      decimals: 18,
    },
    rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com"],
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
  },
  {
    id: 56,
    name: "BNB Smart Chain",
    network: "bsc",
    type: "EVM",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://bsc-dataseed.binance.org"],
    blockExplorerUrls: ["https://bscscan.com"],
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/info/logo.png",
  },
  {
    id: 137,
    name: "Polygon",
    network: "polygon",
    type: "EVM",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://polygonscan.com"],
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
  },
  {
    id: 42161,
    name: "Arbitrum",
    network: "arbitrum",
    type: "EVM",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://arbiscan.io"],
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png",
  },
  {
    id: 10,
    name: "Optimism",
    network: "optimism",
    type: "EVM",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.optimism.io"],
    blockExplorerUrls: ["https://optimistic.etherscan.io"],
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png",
  },
  {
    id: 43114,
    name: "Avalanche",
    network: "avalanche",
    type: "EVM",
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://snowtrace.io"],
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/info/logo.png",
  },
  // Non-EVM Chains
  {
    id: "solana",
    name: "Solana",
    network: "solana",
    type: "SOLANA",
    nativeCurrency: {
      name: "SOL",
      symbol: "SOL",
      decimals: 9,
    },
    rpcUrls: ["https://api.mainnet-beta.solana.com"],
    blockExplorerUrls: ["https://explorer.solana.com"],
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png",
  },
  {
    id: "aptos",
    name: "Aptos",
    network: "aptos",
    type: "APTOS",
    nativeCurrency: {
      name: "APT",
      symbol: "APT",
      decimals: 8,
    },
    rpcUrls: ["https://fullnode.mainnet.aptoslabs.com"],
    blockExplorerUrls: ["https://explorer.aptoslabs.com"],
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/aptos/info/logo.png",
  },
  {
    id: "aptos-testnet",
    name: "Aptos Testnet",
    network: "aptos-testnet",
    type: "APTOS",
    nativeCurrency: {
      name: "APT",
      symbol: "APT",
      decimals: 8,
    },
    rpcUrls: ["https://fullnode.testnet.aptoslabs.com/v1"],
    blockExplorerUrls: ["https://explorer.aptoslabs.com/?network=testnet"],
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/aptos/info/logo.png",
  },
  {
    id: "sui",
    name: "Sui",
    network: "sui",
    type: "SUI",
    nativeCurrency: {
      name: "SUI",
      symbol: "SUI",
      decimals: 9,
    },
    rpcUrls: ["https://fullnode.mainnet.sui.io"],
    blockExplorerUrls: ["https://suiexplorer.com"],
    logoURI: "https://raw.githubusercontent.com/sui-foundation/sui-brand-kit/main/logos/svg/sui-logo-icon.svg",
  },
  {
    id: "near",
    name: "NEAR",
    network: "near",
    type: "NEAR",
    nativeCurrency: {
      name: "NEAR",
      symbol: "NEAR",
      decimals: 24,
    },
    rpcUrls: ["https://rpc.mainnet.near.org"],
    blockExplorerUrls: ["https://nearblocks.io"],
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/near/info/logo.png",
  },
  {
    id: "cosmos",
    name: "Cosmos",
    network: "cosmos",
    type: "COSMOS",
    nativeCurrency: {
      name: "ATOM",
      symbol: "ATOM",
      decimals: 6,
    },
    rpcUrls: ["https://rpc.cosmos.network"],
    blockExplorerUrls: ["https://www.mintscan.io/cosmos"],
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/cosmos/info/logo.png",
  },
  {
    id: "tron",
    name: "TRON",
    network: "tron",
    type: "TRON",
    nativeCurrency: {
      name: "TRX",
      symbol: "TRX",
      decimals: 6,
    },
    rpcUrls: ["https://api.trongrid.io"],
    blockExplorerUrls: ["https://tronscan.io"],
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/tron/info/logo.png",
  },
  {
    id: "stellar",
    name: "Stellar",
    network: "stellar",
    type: "STELLAR",
    nativeCurrency: {
      name: "XLM",
      symbol: "XLM",
      decimals: 7,
    },
    rpcUrls: ["https://horizon.stellar.org"],
    blockExplorerUrls: ["https://stellar.expert"],
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/stellar/info/logo.png",
  },
  {
    id: "ton",
    name: "TON",
    network: "ton",
    type: "TON",
    nativeCurrency: {
      name: "Toncoin",
      symbol: "TON",
      decimals: 9,
    },
    rpcUrls: ["https://toncenter.com/api/v2/jsonRPC"],
    blockExplorerUrls: ["https://tonscan.org"],
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ton/info/logo.png",
  },
];

// Default token lists for each chain
export const DEFAULT_TOKENS: Record<number | string, Token[]> = {
  1: [
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      decimals: 6,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      chainId: 1,
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      decimals: 6,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
      chainId: 1,
    },
    {
      symbol: "DAI",
      name: "Dai Stablecoin",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      decimals: 18,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
      chainId: 1,
    },
    {
      symbol: "WETH",
      name: "Wrapped Ether",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      decimals: 18,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
      chainId: 1,
    },
  ],
  11155111: [
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      decimals: 6,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      chainId: 11155111,
    },
    {
      symbol: "WETH",
      name: "Wrapped Ether",
      address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
      decimals: 18,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
      chainId: 11155111,
    },
  ],
  56: [
    {
      symbol: "USDT",
      name: "Tether USD",
      address: "0x55d398326f99059fF775485246999027B3197955",
      decimals: 18,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
      chainId: 56,
    },
    {
      symbol: "BUSD",
      name: "Binance USD",
      address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      decimals: 18,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/logo.png",
      chainId: 56,
    },
    {
      symbol: "WBNB",
      name: "Wrapped BNB",
      address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      decimals: 18,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/info/logo.png",
      chainId: 56,
    },
  ],
  137: [
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      decimals: 6,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      chainId: 137,
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      decimals: 6,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
      chainId: 137,
    },
    {
      symbol: "WMATIC",
      name: "Wrapped Matic",
      address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      decimals: 18,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
      chainId: 137,
    },
  ],
  42161: [
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
      decimals: 6,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      chainId: 42161,
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
      decimals: 6,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
      chainId: 42161,
    },
    {
      symbol: "WETH",
      name: "Wrapped Ether",
      address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
      decimals: 18,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
      chainId: 42161,
    },
  ],
  10: [
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
      decimals: 6,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      chainId: 10,
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
      decimals: 6,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
      chainId: 10,
    },
    {
      symbol: "WETH",
      name: "Wrapped Ether",
      address: "0x4200000000000000000000000000000000000006",
      decimals: 18,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
      chainId: 10,
    },
  ],
  43114: [
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      decimals: 6,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      chainId: 43114,
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      address: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
      decimals: 6,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
      chainId: 43114,
    },
    {
      symbol: "WAVAX",
      name: "Wrapped AVAX",
      address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
      decimals: 18,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/info/logo.png",
      chainId: 43114,
    },
  ],
  // Non-EVM chain tokens
  solana: [
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      decimals: 6,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      chainId: "solana",
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
      decimals: 6,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
      chainId: "solana",
    },
    {
      symbol: "WSOL",
      name: "Wrapped SOL",
      address: "So11111111111111111111111111111111111111112",
      decimals: 9,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png",
      chainId: "solana",
    },
  ],
  aptos: [
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T",
      decimals: 6,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      chainId: "aptos",
    },
    {
      symbol: "APT",
      name: "Aptos Coin",
      address: "0x1::aptos_coin::AptosCoin",
      decimals: 8,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/aptos/info/logo.png",
      chainId: "aptos",
    },
  ],
  "aptos-testnet": [
    {
      symbol: "APT",
      name: "Aptos Coin",
      address: "0x1::aptos_coin::AptosCoin",
      decimals: 8,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/aptos/info/logo.png",
      chainId: "aptos-testnet",
    },
    {
      symbol: "USDC",
      name: "USD Coin (Test)",
      address: "0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T",
      decimals: 6,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      chainId: "aptos-testnet",
    },
  ],
  sui: [
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN",
      decimals: 6,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      chainId: "sui",
    },
    {
      symbol: "SUI",
      name: "Sui",
      address: "0x2::sui::SUI",
      decimals: 9,
      logoURI: "https://raw.githubusercontent.com/sui-foundation/sui-brand-kit/main/logos/svg/sui-logo-icon.svg",
      chainId: "sui",
    },
  ],
  near: [
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
      decimals: 6,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      chainId: "near",
    },
    {
      symbol: "NEAR",
      name: "NEAR",
      address: "wrap.near",
      decimals: 24,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/near/info/logo.png",
      chainId: "near",
    },
  ],
  cosmos: [
    {
      symbol: "ATOM",
      name: "Cosmos",
      address: "uatom",
      decimals: 6,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/cosmos/info/logo.png",
      chainId: "cosmos",
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4",
      decimals: 6,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      chainId: "cosmos",
    },
  ],
  tron: [
    {
      symbol: "USDT",
      name: "Tether USD",
      address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
      decimals: 6,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
      chainId: "tron",
    },
    {
      symbol: "TRX",
      name: "TRON",
      address: "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb",
      decimals: 6,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/tron/info/logo.png",
      chainId: "tron",
    },
  ],
  stellar: [
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
      decimals: 7,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      chainId: "stellar",
    },
    {
      symbol: "XLM",
      name: "Stellar Lumens",
      address: "native",
      decimals: 7,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/stellar/info/logo.png",
      chainId: "stellar",
    },
  ],
  ton: [
    {
      symbol: "TON",
      name: "Toncoin",
      address: "native",
      decimals: 9,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ton/info/logo.png",
      chainId: "ton",
    },
    {
      symbol: "USDT",
      name: "Tether USD", 
      address: "EQCxE6mUtQJKFnGfaROTKOtYEqW-SjWTSqkw7FrYaA_0_Rov",
      decimals: 6,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
      chainId: "ton",
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "EQDg6iu0d8A30hgV7lkUlj0WE7S1j1r-NcF8W5LTpD78Hnvr",
      decimals: 6,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      chainId: "ton",
    },
  ],
};

// Non-EVM chains configuration
export const NON_EVM_CHAINS = {
  APTOS: {
    name: "Aptos",
    id: "aptos",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/aptos/info/logo.png",
  },
  SUI: {
    name: "Sui",
    id: "sui",
    logoURI: "https://raw.githubusercontent.com/sui-foundation/sui-brand-kit/main/logos/svg/sui-logo-icon.svg",
  },
  COSMOS: {
    name: "Cosmos",
    id: "cosmos",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/cosmos/info/logo.png",
  },
  STELLAR: {
    name: "Stellar",
    id: "stellar",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/stellar/info/logo.png",
  },
  TRON: {
    name: "Tron",
    id: "tron",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/tron/info/logo.png",
  },
  TON: {
    name: "TON",
    id: "ton",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ton/info/logo.png",
  },
};