export interface AptosWalletConfig {
  name: string;
  icon: string;
}

export interface AptosTransactionPayload {
  function: string;
  typeArguments?: string[];
  functionArguments?: any[];
}

export class OKXAptosService {
  private account: { address: string; publicKey: string } | null = null;
  private connectionListeners: ((connected: boolean) => void)[] = [];
  private config: AptosWalletConfig;

  constructor(config: AptosWalletConfig) {
    this.config = config;
  }

  private getAptosWallet() {
    if (typeof window !== 'undefined' && window.okxwallet?.aptos) {
      return window.okxwallet.aptos;
    }
    return null;
  }

  async connect(): Promise<{ address: string; publicKey: string }> {
    const wallet = this.getAptosWallet();
    if (!wallet) {
      throw new Error("OKX Wallet not found. Please install OKX Wallet extension.");
    }

    try {
      const response = await wallet.connect();
      if (response && response.address) {
        this.account = {
          address: response.address,
          publicKey: response.publicKey || ""
        };
        this.notifyConnectionListeners(true);
        return this.account;
      }
      throw new Error("Failed to connect to OKX Wallet");
    } catch (error: any) {
      console.error("Failed to connect to OKX Wallet:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    const wallet = this.getAptosWallet();
    if (!wallet) return;

    try {
      await wallet.disconnect();
      this.account = null;
      this.notifyConnectionListeners(false);
    } catch (error) {
      console.error("Failed to disconnect:", error);
      throw error;
    }
  }

  isConnected(): boolean {
    return this.account !== null;
  }

  getAccount(): { address: string; publicKey: string } | null {
    return this.account;
  }

  async getNetwork(): Promise<string> {
    const wallet = this.getAptosWallet();
    if (!wallet) {
      throw new Error("Wallet not connected");
    }
    
    try {
      const network = await wallet.network();
      return network.name || network || "unknown";
    } catch (error) {
      console.error("Failed to get network:", error);
      return "unknown";
    }
  }

  async signAndSubmitTransaction(
    payload: AptosTransactionPayload
  ): Promise<{ hash: string }> {
    const wallet = this.getAptosWallet();
    if (!wallet || !this.account) {
      throw new Error("Wallet not connected");
    }

    try {
      const transaction = {
        arguments: payload.functionArguments || [],
        function: payload.function,
        type: "entry_function_payload" as const,
        type_arguments: payload.typeArguments || [],
      };

      const pendingTransaction = await wallet.signAndSubmitTransaction(transaction);
      
      return { hash: pendingTransaction.hash };
    } catch (error: any) {
      console.error("Transaction failed:", error);
      throw error;
    }
  }

  async signMessage(message: string): Promise<string> {
    const wallet = this.getAptosWallet();
    if (!wallet || !this.account) {
      throw new Error("Wallet not connected");
    }

    try {
      const response = await wallet.signMessage({
        message,
        nonce: Math.random().toString(),
      });
      
      return response.signature;
    } catch (error) {
      console.error("Failed to sign message:", error);
      throw error;
    }
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

  // Helper method to format Aptos addresses
  formatAddress(address: string): string {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  // Helper method to validate Aptos address
  isValidAptosAddress(address: string): boolean {
    // Aptos addresses are 64 hex characters (32 bytes) with optional 0x prefix
    const cleanAddress = address.startsWith("0x") ? address.slice(2) : address;
    return /^[a-fA-F0-9]{64}$/.test(cleanAddress);
  }
}

// Singleton instance
let okxAptosService: OKXAptosService | null = null;

export const getOKXAptosService = (config?: AptosWalletConfig): OKXAptosService => {
  if (!okxAptosService && config) {
    okxAptosService = new OKXAptosService(config);
  }
  if (!okxAptosService) {
    throw new Error('OKX Aptos Service not initialized. Please provide config.');
  }
  return okxAptosService;
};

// Type declarations for window object
declare global {
  interface Window {
    okxwallet?: {
      aptos?: {
        connect: () => Promise<any>;
        disconnect: () => Promise<any>;
        signAndSubmitTransaction: (transaction: any) => Promise<any>;
        signMessage: (params: any) => Promise<any>;
        network: () => Promise<any>;
      };
    };
  }
}