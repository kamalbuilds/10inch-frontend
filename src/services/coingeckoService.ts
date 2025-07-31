interface CoinGeckoMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: null | any;
  last_updated: string;
}

// Map of token symbols to CoinGecko IDs
const COINGECKO_ID_MAP: Record<string, string> = {
  // Native tokens
  ETH: 'ethereum',
  BTC: 'bitcoin',
  BNB: 'binancecoin',
  MATIC: 'matic-network',
  AVAX: 'avalanche-2',
  SOL: 'solana',
  APT: 'aptos',
  SUI: 'sui',
  NEAR: 'near',
  ATOM: 'cosmos',
  TRX: 'tron',
  XLM: 'stellar',
  TON: 'the-open-network',
  
  // Stablecoins
  USDT: 'tether',
  USDC: 'usd-coin',
  DAI: 'dai',
  BUSD: 'binance-usd',
  
  // Wrapped tokens
  WETH: 'ethereum',
  WBNB: 'binancecoin',
  WMATIC: 'matic-network',
  WAVAX: 'avalanche-2',
  WSOL: 'solana',
  
  // Other popular tokens
  LINK: 'chainlink',
  UNI: 'uniswap',
  AAVE: 'aave',
  CRV: 'curve-dao-token',
  SUSHI: 'sushi',
  '1INCH': '1inch',
};

export class CoinGeckoService {
  private readonly baseUrl = 'https://api.coingecko.com/api/v3';
  private priceCache: Map<string, { price: number; timestamp: number }> = new Map();
  private readonly cacheTimeout = 30000; // 30 seconds cache

  async getTokenPrice(tokenSymbol: string): Promise<number | null> {
    const cacheKey = tokenSymbol.toUpperCase();
    const cached = this.priceCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.price;
    }

    const coingeckoId = COINGECKO_ID_MAP[cacheKey];
    if (!coingeckoId) {
      console.warn(`No CoinGecko ID mapping for token: ${tokenSymbol}`);
      return null;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/coins/markets?vs_currency=usd&ids=${coingeckoId}`
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data: CoinGeckoMarketData[] = await response.json();
      
      if (data.length === 0) {
        console.warn(`No price data found for token: ${tokenSymbol}`);
        return null;
      }

      const price = data[0].current_price;
      this.priceCache.set(cacheKey, { price, timestamp: Date.now() });
      
      return price;
    } catch (error) {
      console.error(`Failed to fetch price for ${tokenSymbol}:`, error);
      return null;
    }
  }

  async getMultipleTokenPrices(tokenSymbols: string[]): Promise<Record<string, number>> {
    const uniqueSymbols = [...new Set(tokenSymbols.map(s => s.toUpperCase()))];
    const prices: Record<string, number> = {};
    
    // Check cache first
    const uncachedSymbols: string[] = [];
    for (const symbol of uniqueSymbols) {
      const cached = this.priceCache.get(symbol);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        prices[symbol] = cached.price;
      } else {
        uncachedSymbols.push(symbol);
      }
    }

    if (uncachedSymbols.length === 0) {
      return prices;
    }

    // Get CoinGecko IDs for uncached symbols
    const coingeckoIds: string[] = [];
    const symbolToIdMap: Record<string, string> = {};
    
    for (const symbol of uncachedSymbols) {
      const id = COINGECKO_ID_MAP[symbol];
      if (id) {
        coingeckoIds.push(id);
        symbolToIdMap[id] = symbol;
      }
    }

    if (coingeckoIds.length === 0) {
      return prices;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/coins/markets?vs_currency=usd&ids=${coingeckoIds.join(',')}`
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data: CoinGeckoMarketData[] = await response.json();
      
      for (const coin of data) {
        const symbol = symbolToIdMap[coin.id];
        if (symbol) {
          prices[symbol] = coin.current_price;
          this.priceCache.set(symbol, { 
            price: coin.current_price, 
            timestamp: Date.now() 
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch multiple token prices:', error);
    }

    return prices;
  }

  async getSwapQuote(
    fromTokenSymbol: string,
    toTokenSymbol: string,
    amount: number
  ): Promise<{
    fromTokenPrice: number;
    toTokenPrice: number;
    estimatedOutput: number;
    exchangeRate: number;
    priceImpact: number;
  } | null> {
    const prices = await this.getMultipleTokenPrices([fromTokenSymbol, toTokenSymbol]);
    
    const fromPrice = prices[fromTokenSymbol.toUpperCase()];
    const toPrice = prices[toTokenSymbol.toUpperCase()];
    
    if (!fromPrice || !toPrice) {
      return null;
    }

    // Calculate swap amounts
    const fromValueUSD = amount * fromPrice;
    const estimatedOutput = fromValueUSD / toPrice;
    const exchangeRate = fromPrice / toPrice;
    
    // Simple price impact calculation (can be improved with liquidity data)
    // For now, we'll use a basic formula based on trade size
    const priceImpact = Math.min((fromValueUSD / 100000) * 0.3, 5); // Max 5% impact

    return {
      fromTokenPrice: fromPrice,
      toTokenPrice: toPrice,
      estimatedOutput,
      exchangeRate,
      priceImpact
    };
  }

  // Get CoinGecko ID for a token symbol
  getCoinGeckoId(tokenSymbol: string): string | null {
    return COINGECKO_ID_MAP[tokenSymbol.toUpperCase()] || null;
  }

  // Add new token mapping
  addTokenMapping(symbol: string, coingeckoId: string): void {
    COINGECKO_ID_MAP[symbol.toUpperCase()] = coingeckoId;
  }
}

// Singleton instance
export const coingeckoService = new CoinGeckoService();