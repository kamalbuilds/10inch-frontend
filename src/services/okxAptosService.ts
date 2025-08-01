import { prepareOKXAptosTransaction } from '../utils/okxWalletFix';

export interface AptosWalletConfig {
  name: string;
  icon: string;
  network?: 'mainnet' | 'testnet';
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
      // Connect with network configuration
      const network = this.config.network || 'mainnet';
      const connectionParams = {
        chain: `aptos:${network}`
      };
      
      console.log('Connecting to OKX Aptos wallet with params:', connectionParams);
      const response = await wallet.connect(connectionParams);
      
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
      console.log("\n=== OKX Aptos Transaction Debug ===");
      console.log("Raw payload:", JSON.stringify(payload, null, 2));
      
      // Process function arguments to ensure proper types
      const processedArguments = payload.functionArguments?.map((arg, index) => {
        console.log(`\nProcessing Argument ${index}:`);
        console.log("  Raw value:", arg);
        console.log("  Type:", typeof arg);
        console.log("  Is Array:", Array.isArray(arg));
        
        // If it's a numeric string that should be a u64/u128, ensure it's properly formatted
        if (typeof arg === 'string' && /^\d+$/.test(arg)) {
          console.log("  Detected as numeric string");
          console.log("  Value length:", arg.length);
          console.log("  As BigInt:", BigInt(arg).toString());
          // Return as string for large numbers (u64/u128)
          return arg;
        }
        
        // If it's an array (like hash bytes), ensure proper formatting
        if (Array.isArray(arg)) {
          console.log("  Array length:", arg.length);
          console.log("  First few elements:", arg.slice(0, 5));
          return arg;
        }
        
        return arg;
      }) || [];

      const transaction = {
        arguments: processedArguments,
        function: payload.function,
        type: "entry_function_payload" as const,
        type_arguments: payload.typeArguments || [],
      };

      console.log("\nProcessed transaction:", JSON.stringify(transaction, null, 2));
      
      // Apply OKX wallet fix
      const preparedTransaction = prepareOKXAptosTransaction(transaction);
      console.log("\nAfter OKX fix:", JSON.stringify(preparedTransaction, null, 2));
      console.log("=== End Debug ===");

      // Add a try-catch specifically for the wallet call
      let pendingTransaction;
      try {
        pendingTransaction = await wallet.signAndSubmitTransaction(preparedTransaction);
      } catch (walletError: any) {
        console.error("\n=== OKX Wallet Error ===");
        console.error("Error type:", walletError.constructor.name);
        console.error("Error message:", walletError.message);
        console.error("Error code:", walletError.code);
        console.error("Full error:", walletError);
        
        // Check if it's the BigInt conversion error
        if (walletError.message && walletError.message.includes('Cannot convert') && walletError.message.includes('to BigInt')) {
          console.error("\nThis appears to be a BigInt conversion error inside OKX wallet.");
          console.error("The wallet might be trying to process the original decimal amount instead of the converted value.");
        }
        
        throw walletError;
      }
      
      return { hash: pendingTransaction.hash };
    } catch (error: any) {
      console.error("\nTransaction failed:", error);
      console.error("Error details:", error.message, error.code);
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

