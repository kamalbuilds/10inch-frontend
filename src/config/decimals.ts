// Token Decimals Configuration for 1inch Fusion+
// This file documents the decimal places for native tokens across different chains

export const NATIVE_TOKEN_DECIMALS = {
  // EVM Chains (18 decimals)
  ETHEREUM: 18,      // 1 ETH = 10^18 Wei
  POLYGON: 18,       // 1 MATIC = 10^18 Wei
  BSC: 18,           // 1 BNB = 10^18 Wei
  ARBITRUM: 18,      // 1 ETH = 10^18 Wei
  OPTIMISM: 18,      // 1 ETH = 10^18 Wei
  AVALANCHE: 18,     // 1 AVAX = 10^18 Wei
  
  // Non-EVM Chains (variable decimals)
  APTOS: 8,          // 1 APT = 10^8 Octas
  SUI: 9,            // 1 SUI = 10^9 MIST
  NEAR: 24,          // 1 NEAR = 10^24 yoctoNEAR
  STELLAR: 7,        // 1 XLM = 10^7 stroops
  TRON: 6,           // 1 TRX = 10^6 Sun
  SOLANA: 9,         // 1 SOL = 10^9 lamports
  COSMOS: 6,         // 1 ATOM = 10^6 uatom
  TON: 9,            // 1 TON = 10^9 nanoTON
} as const;

// Common token decimals by standard
export const TOKEN_DECIMALS = {
  // Common ERC20 decimals
  USDC: 6,           // USDC uses 6 decimals on most chains
  USDT: 6,           // USDT uses 6 decimals on most chains
  DAI: 18,           // DAI uses 18 decimals
  WETH: 18,          // Wrapped ETH uses 18 decimals
  WBTC: 8,           // Wrapped BTC uses 8 decimals
  
  // Chain-specific wrapped tokens
  WMATIC: 18,        // Wrapped MATIC on Polygon
  WBNB: 18,          // Wrapped BNB on BSC
  WAVAX: 18,         // Wrapped AVAX on Avalanche
} as const;

// Helper to get decimals for a token
export function getTokenDecimals(chain: string, tokenSymbol?: string): number {
  // If no token symbol provided, assume native token
  if (!tokenSymbol || tokenSymbol === 'native') {
    return NATIVE_TOKEN_DECIMALS[chain as keyof typeof NATIVE_TOKEN_DECIMALS] || 18;
  }
  
  // Check common token decimals
  const upperSymbol = tokenSymbol.toUpperCase();
  if (upperSymbol in TOKEN_DECIMALS) {
    return TOKEN_DECIMALS[upperSymbol as keyof typeof TOKEN_DECIMALS];
  }
  
  // Default to 18 for unknown tokens (common for ERC20)
  return 18;
}

// Convert human-readable amount to smallest unit
export function toSmallestUnit(amount: string | number, decimals: number): string {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (decimals <= 9) {
    // For smaller decimals, use regular multiplication to avoid precision issues
    return Math.floor(value * Math.pow(10, decimals)).toString();
  } else {
    // For larger decimals, use BigInt to handle large numbers
    const factor = BigInt(10) ** BigInt(decimals);
    const wholePart = Math.floor(value);
    const fractionalPart = value - wholePart;
    
    const wholeUnits = BigInt(wholePart) * factor;
    const fractionalUnits = BigInt(Math.floor(fractionalPart * Number(factor)));
    
    return (wholeUnits + fractionalUnits).toString();
  }
}

// Convert smallest unit to human-readable amount
export function fromSmallestUnit(amount: string | bigint, decimals: number): string {
  const value = typeof amount === 'string' ? BigInt(amount) : amount;
  const factor = BigInt(10) ** BigInt(decimals);
  
  const wholePart = value / factor;
  const remainder = value % factor;
  
  // Convert to decimal string
  const wholeStr = wholePart.toString();
  const remainderStr = remainder.toString().padStart(decimals, '0');
  
  // Remove trailing zeros
  const trimmedRemainder = remainderStr.replace(/0+$/, '');
  
  if (trimmedRemainder === '') {
    return wholeStr;
  }
  
  return `${wholeStr}.${trimmedRemainder}`;
}

// Examples of usage:
// toSmallestUnit("0.2", 8) => "20000000" (for APT)
// toSmallestUnit("1.5", 18) => "1500000000000000000" (for ETH)
// fromSmallestUnit("20000000", 8) => "0.2" (for APT)
// fromSmallestUnit("1500000000000000000", 18) => "1.5" (for ETH)