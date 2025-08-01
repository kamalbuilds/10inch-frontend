// 1inch API configuration
const ONE_INCH_API_KEY = process.env.NEXT_PUBLIC_ONE_INCH_API_KEY || '';

// Backend API configuration
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

// Chain IDs supported by 1inch
export const ONE_INCH_CHAINS = {
  ETHEREUM: 1,
  BSC: 56,
  POLYGON: 137,
  OPTIMISM: 10,
  ARBITRUM: 42161,
  GNOSIS: 100,
  AVALANCHE: 43114,
  FANTOM: 250,
  KLAYTN: 8217,
  AURORA: 1313161554,
  ZKSYNC: 324,
  BASE: 8453,
} as const;

export interface TokenInfo {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI?: string;
  tags?: string[];
  eip2612?: boolean;
  isFoT?: boolean;
  displayedSymbol?: string;
}

export interface QuoteParams {
  src: string; // source token address
  dst: string; // destination token address
  amount: string; // amount in minimal divisible units
  includeTokensInfo?: boolean;
  includeProtocols?: boolean;
  includeGas?: boolean;
  connectorTokens?: string;
  complexityLevel?: string;
  gasLimit?: string;
  mainRouteParts?: string;
  parts?: string;
  gasPrice?: string;
}

export interface SwapParams extends QuoteParams {
  from: string; // user address
  slippage: number; // slippage percentage (1 = 1%)
  disableEstimate?: boolean;
  allowPartialFill?: boolean;
  receiver?: string;
  referrer?: string;
  fee?: number;
}

export interface BalanceParams {
  walletAddress: string;
  contractAddresses?: string[];
}

class OneInchService {
  private chainId: number;

  constructor(chainId: number = ONE_INCH_CHAINS.ETHEREUM) {
    this.chainId = chainId;
  }

  setChainId(chainId: number) {
    this.chainId = chainId;
  }

  // Helper function to make API calls to our backend
  private async makeApiCall(endpoint: string, params?: Record<string, any>): Promise<any> {
    const url = new URL(endpoint, BACKEND_BASE_URL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Token API
  async getTokenList(): Promise<Record<string, TokenInfo>> {
    try {
      const response = await this.makeApiCall('/api/1inch/tokens', { chainId: this.chainId });
      return response.tokens;
    } catch (error) {
      console.error('Error fetching token list:', error);
      throw error;
    }
  }

  async searchTokens(query: string): Promise<TokenInfo[]> {
    try {
      return await this.makeApiCall('/api/1inch/tokens/search', { chainId: this.chainId, query });
    } catch (error) {
      console.error('Error searching tokens:', error);
      throw error;
    }
  }

  async getCustomTokens(addresses: string[]): Promise<Record<string, TokenInfo>> {
    try {
      const response = await fetch('/api/1inch/tokens/custom', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chainId: this.chainId, addresses }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching custom tokens:', error);
      throw error;
    }
  }

  // Balance API
  async getBalances(params: BalanceParams): Promise<Record<string, string>> {
    try {
      const apiParams: Record<string, any> = { chainId: this.chainId, ...params };
      if (params.contractAddresses) {
        apiParams.contractAddresses = params.contractAddresses.join(',');
      }

      return await this.makeApiCall('/api/1inch/balances', apiParams);
    } catch (error) {
      console.error('Error fetching balances:', error);
      throw error;
    }
  }

  async getAllowances(
    walletAddress: string,
    contractAddresses?: string[]
  ): Promise<Record<string, Record<string, string>>> {
    try {
      const params: Record<string, any> = { chainId: this.chainId, walletAddress };
      if (contractAddresses) {
        params.contractAddresses = contractAddresses.join(',');
      }

      return await this.makeApiCall('/api/1inch/allowances', params);
    } catch (error) {
      console.error('Error fetching allowances:', error);
      throw error;
    }
  }

  // Swap API
  async getQuote(params: QuoteParams): Promise<any> {
    try {
      return await this.makeApiCall('/api/1inch/quote', { chainId: this.chainId, ...params });
    } catch (error) {
      console.error('Error fetching quote:', error);
      throw error;
    }
  }

  async buildSwapTransaction(params: SwapParams): Promise<any> {
    try {
      return await this.makeApiCall('/api/1inch/swap', { chainId: this.chainId, ...params });
    } catch (error) {
      console.error('Error building swap transaction:', error);
      throw error;
    }
  }

  // Gas Price API
  async getGasPrice(): Promise<any> {
    try {
      return await this.makeApiCall('/api/1inch/gas-price', { chainId: this.chainId });
    } catch (error) {
      console.error('Error fetching gas price:', error);
      throw error;
    }
  }

  // Approve API
  async getApproveCalldata(
    tokenAddress: string,
    amount?: string
  ): Promise<any> {
    try {
      const params = {
        chainId: this.chainId,
        tokenAddress,
        amount: amount || '115792089237316195423570985008687907853269984665640564039457584007913129639935' // max uint256
      };

      return await this.makeApiCall('/api/1inch/approve/calldata', params);
    } catch (error) {
      console.error('Error fetching approve calldata:', error);
      throw error;
    }
  }

  async getApproveSpender(): Promise<{ address: string }> {
    try {
      return await this.makeApiCall('/api/1inch/approve/spender', { chainId: this.chainId });
    } catch (error) {
      console.error('Error fetching approve spender:', error);
      throw error;
    }
  }

  // Liquidity Sources API
  async getLiquiditySources(): Promise<any> {
    try {
      return await this.makeApiCall('/api/1inch/liquidity-sources', { chainId: this.chainId });
    } catch (error) {
      console.error('Error fetching liquidity sources:', error);
      throw error;
    }
  }

  // Utils
  isNativeToken(address: string): boolean {
    return address.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
  }

  async getTokenBySymbol(symbol: string): Promise<TokenInfo | null> {
    try {
      const tokens = await this.getTokenList();
      const token = Object.values(tokens).find(
        t => t.symbol.toLowerCase() === symbol.toLowerCase()
      );
      return token || null;
    } catch (error) {
      console.error('Error finding token by symbol:', error);
      return null;
    }
  }

  async getTokenByAddress(address: string): Promise<TokenInfo | null> {
    try {
      const tokens = await this.getTokenList();
      return tokens[address.toLowerCase()] || null;
    } catch (error) {
      console.error('Error finding token by address:', error);
      return null;
    }
  }
}

// Create instances for each supported chain
export const oneInchServices: Record<number, OneInchService> = {
  [ONE_INCH_CHAINS.ETHEREUM]: new OneInchService(ONE_INCH_CHAINS.ETHEREUM),
  [ONE_INCH_CHAINS.BSC]: new OneInchService(ONE_INCH_CHAINS.BSC),
  [ONE_INCH_CHAINS.POLYGON]: new OneInchService(ONE_INCH_CHAINS.POLYGON),
  [ONE_INCH_CHAINS.OPTIMISM]: new OneInchService(ONE_INCH_CHAINS.OPTIMISM),
  [ONE_INCH_CHAINS.ARBITRUM]: new OneInchService(ONE_INCH_CHAINS.ARBITRUM),
  [ONE_INCH_CHAINS.AVALANCHE]: new OneInchService(ONE_INCH_CHAINS.AVALANCHE),
  [ONE_INCH_CHAINS.BASE]: new OneInchService(ONE_INCH_CHAINS.BASE),
};

export default OneInchService;