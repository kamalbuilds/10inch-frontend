import axios, { AxiosInstance } from 'axios';

// 1inch API configuration
const ONE_INCH_API_KEY = process.env.NEXT_PUBLIC_ONE_INCH_API_KEY || '';
const ONE_INCH_BASE_URL = 'https://api.1inch.dev';

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
  private axiosInstance: AxiosInstance;
  private chainId: number;

  constructor(chainId: number = ONE_INCH_CHAINS.ETHEREUM) {
    this.chainId = chainId;
    this.axiosInstance = axios.create({
      baseURL: ONE_INCH_BASE_URL,
      headers: {
        'Authorization': `Bearer ${ONE_INCH_API_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  setChainId(chainId: number) {
    this.chainId = chainId;
  }

  // Token API
  async getTokenList(): Promise<Record<string, TokenInfo>> {
    try {
      const response = await this.axiosInstance.get(
        `/token/v1.2/${this.chainId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching token list:', error);
      throw error;
    }
  }

  async searchTokens(query: string): Promise<TokenInfo[]> {
    try {
      const response = await this.axiosInstance.get(
        `/token/v1.2/${this.chainId}/search`,
        { params: { query } }
      );
      return response.data;
    } catch (error) {
      console.error('Error searching tokens:', error);
      throw error;
    }
  }

  async getCustomTokens(addresses: string[]): Promise<Record<string, TokenInfo>> {
    try {
      const response = await this.axiosInstance.post(
        `/token/v1.2/${this.chainId}/custom`,
        { addresses }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching custom tokens:', error);
      throw error;
    }
  }

  // Balance API
  async getBalances(params: BalanceParams): Promise<Record<string, string>> {
    try {
      const response = await this.axiosInstance.get(
        `/balance/v1.2/${this.chainId}/balances/${params.walletAddress}`,
        { params: { contractAddresses: params.contractAddresses?.join(',') } }
      );
      return response.data;
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
      const response = await this.axiosInstance.get(
        `/balance/v1.2/${this.chainId}/allowances/${walletAddress}`,
        { params: { contractAddresses: contractAddresses?.join(',') } }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching allowances:', error);
      throw error;
    }
  }

  // Swap API
  async getQuote(params: QuoteParams): Promise<any> {
    try {
      const response = await this.axiosInstance.get(
        `/swap/v6.0/${this.chainId}/quote`,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching quote:', error);
      throw error;
    }
  }

  async buildSwapTransaction(params: SwapParams): Promise<any> {
    try {
      const response = await this.axiosInstance.get(
        `/swap/v6.0/${this.chainId}/swap`,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error('Error building swap transaction:', error);
      throw error;
    }
  }

  // Gas Price API
  async getGasPrice(): Promise<any> {
    try {
      const response = await this.axiosInstance.get(
        `/gas-price/v1.5/${this.chainId}`
      );
      return response.data;
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
      const response = await this.axiosInstance.get(
        `/approve/v1.1/${this.chainId}/approve/transaction`,
        { 
          params: { 
            tokenAddress,
            amount: amount || '115792089237316195423570985008687907853269984665640564039457584007913129639935' // max uint256
          } 
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching approve calldata:', error);
      throw error;
    }
  }

  async getApproveSpender(): Promise<{ address: string }> {
    try {
      const response = await this.axiosInstance.get(
        `/approve/v1.1/${this.chainId}/approve/spender`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching approve spender:', error);
      throw error;
    }
  }

  // Liquidity Sources API
  async getLiquiditySources(): Promise<any> {
    try {
      const response = await this.axiosInstance.get(
        `/swap/v6.0/${this.chainId}/liquidity-sources`
      );
      return response.data;
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