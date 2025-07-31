// Global type declarations

declare global {
  interface Window {
    ethereum?: any;
    okxwallet?: {
      aptos?: {
        connect: (params?: { chain?: string }) => Promise<any>;
        disconnect: () => Promise<any>;
        signAndSubmitTransaction: (transaction: any) => Promise<any>;
        signMessage: (params: any) => Promise<any>;
        network: () => Promise<any>;
      };
    };
  }
}

export {};