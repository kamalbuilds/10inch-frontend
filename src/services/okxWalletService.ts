import { OKXTonConnect, OKXConnectError, OKX_CONNECT_ERROR_CODES, Account, Wallet } from "@okxconnect/tonsdk";

export interface OKXWalletConfig {
  name: string;
  icon: string;
}

export interface TransactionMessage {
  address: string;
  amount: string;
  stateInit?: string;
  payload?: string;
}

export interface TransactionRequest {
  validUntil: number;
  from?: string;
  messages: TransactionMessage[];
}

export interface SendTransactionResponse {
  boc: string;
}

export class OKXWalletService {
  private connector: OKXTonConnect;
  private connectionListeners: ((connected: boolean) => void)[] = [];

  constructor(config: OKXWalletConfig) {
    this.connector = new OKXTonConnect({
      metaData: {
        name: config.name,
        icon: config.icon
      },
      connectors: [] // Add empty connectors array if required
    } as any);
  }

  async connect(options?: {
    tonProof?: string;
    redirect?: string;
    openUniversalLink?: boolean;
  }): Promise<string> {
    try {
      const result = await this.connector.connect(options || {});
      this.notifyConnectionListeners(true);
      return result;
    } catch (error) {
      if (error instanceof OKXConnectError) {
        this.handleConnectError(error);
      }
      throw error;
    }
  }

  async restoreConnection(): Promise<void> {
    try {
      await this.connector.restoreConnection();
      if (this.isConnected()) {
        this.notifyConnectionListeners(true);
      }
    } catch (error) {
      console.error('Failed to restore connection:', error);
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.connector.disconnect();
      this.notifyConnectionListeners(false);
    } catch (error) {
      if (error instanceof OKXConnectError) {
        switch (error.code) {
          case OKX_CONNECT_ERROR_CODES.NOT_CONNECTED_ERROR:
            console.warn('Wallet not connected');
            break;
          default:
            throw error;
        }
      }
    }
  }

  isConnected(): boolean {
    return this.connector.connected;
  }

  getAccount(): Account | null {
    return this.isConnected() ? this.connector.account : null;
  }

  getWallet(): Wallet | null {
    return this.isConnected() ? this.connector.wallet : null;
  }

  async sendTransaction(
    transaction: TransactionRequest,
    options?: {
      onRequestSent?: () => void;
    }
  ): Promise<SendTransactionResponse> {
    try {
      return await this.connector.sendTransaction(transaction, options || {});
    } catch (error) {
      if (error instanceof OKXConnectError) {
        this.handleTransactionError(error);
      }
      throw error;
    }
  }

  onStatusChange(
    callback: (walletInfo: Wallet | null) => void,
    errorHandler?: (err: OKXConnectError) => void
  ): () => void {
    return this.connector.onStatusChange(callback, errorHandler);
  }

  onConnectionChange(listener: (connected: boolean) => void): () => void {
    this.connectionListeners.push(listener);
    return () => {
      const index = this.connectionListeners.indexOf(listener);
      if (index > -1) {
        this.connectionListeners.splice(index, 1);
      }
    };
  }

  private notifyConnectionListeners(connected: boolean): void {
    this.connectionListeners.forEach(listener => listener(connected));
  }

  private handleConnectError(error: OKXConnectError): void {
    switch (error.code) {
      case OKX_CONNECT_ERROR_CODES.USER_REJECTS_ERROR:
        throw new Error('User rejected the connection');
      case OKX_CONNECT_ERROR_CODES.ALREADY_CONNECTED_ERROR:
        throw new Error('Wallet already connected');
      case OKX_CONNECT_ERROR_CODES.METHOD_NOT_SUPPORTED:
        throw new Error('Method not supported');
      default:
        throw new Error(`Connection failed: ${error.message}`);
    }
  }

  private handleTransactionError(error: OKXConnectError): void {
    switch (error.code) {
      case OKX_CONNECT_ERROR_CODES.USER_REJECTS_ERROR:
        throw new Error('User rejected the transaction');
      case OKX_CONNECT_ERROR_CODES.NOT_CONNECTED_ERROR:
        throw new Error('Wallet not connected');
      default:
        throw new Error(`Transaction failed: ${error.message}`);
    }
  }

  // Helper method to format TON addresses
  formatAddress(address: string): string {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  // Helper method to validate TON address
  isValidTONAddress(address: string): boolean {
    // TON addresses start with 0: or -1:
    return /^(-1|0):[a-fA-F0-9]{64}$/.test(address);
  }
}

// Singleton instance
let okxWalletService: OKXWalletService | null = null;

export const getOKXWalletService = (config?: OKXWalletConfig): OKXWalletService => {
  if (!okxWalletService && config) {
    okxWalletService = new OKXWalletService(config);
  }
  if (!okxWalletService) {
    throw new Error('OKX Wallet Service not initialized. Please provide config.');
  }
  return okxWalletService;
};