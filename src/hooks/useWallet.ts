import { useState, useEffect } from "react";
import { ethers } from "ethers";

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  balance: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
}

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    balance: null,
    provider: null,
    signer: null,
  });

  const connect = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask or another Web3 wallet");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(accounts[0]);

      setWalletState({
        isConnected: true,
        address: accounts[0],
        chainId: Number(network.chainId),
        balance: ethers.formatEther(balance),
        provider,
        signer,
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const disconnect = () => {
    setWalletState({
      isConnected: false,
      address: null,
      chainId: null,
      balance: null,
      provider: null,
      signer: null,
    });
  };

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (!window.ethereum) return;

        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_accounts", []);
        
        if (accounts.length > 0) {
          // Wallet is already connected
          const signer = await provider.getSigner();
          const network = await provider.getNetwork();
          const balance = await provider.getBalance(accounts[0]);

          setWalletState({
            isConnected: true,
            address: accounts[0],
            chainId: Number(network.chainId),
            balance: ethers.formatEther(balance),
            provider,
            signer,
          });
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    };

    checkConnection();
  }, []);

  const switchChain = async (chainId: number) => {
    try {
      if (!window.ethereum) return;

      const chainIdHex = `0x${chainId.toString(16)}`;
      
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainIdHex }],
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          // Add the chain
          const chainData = getChainData(chainId);
          if (chainData) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [chainData],
            });
          }
        } else {
          throw switchError;
        }
      }

      // Update wallet state after switch
      if (walletState.isConnected) {
        await connect();
      }
    } catch (error) {
      console.error("Error switching chain:", error);
    }
  };

  // Listen for account and chain changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else if (walletState.isConnected) {
        connect();
      }
    };

    const handleChainChanged = () => {
      if (walletState.isConnected) {
        connect();
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [walletState.isConnected]);

  return {
    ...walletState,
    connect,
    disconnect,
    switchChain,
  };
}

// Helper function to get chain data for adding to MetaMask
function getChainData(chainId: number) {
  const chains: Record<number, any> = {
    56: {
      chainId: "0x38",
      chainName: "BNB Smart Chain",
      nativeCurrency: {
        name: "BNB",
        symbol: "BNB",
        decimals: 18,
      },
      rpcUrls: ["https://bsc-dataseed.binance.org"],
      blockExplorerUrls: ["https://bscscan.com"],
    },
    137: {
      chainId: "0x89",
      chainName: "Polygon",
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18,
      },
      rpcUrls: ["https://polygon-rpc.com"],
      blockExplorerUrls: ["https://polygonscan.com"],
    },
    42161: {
      chainId: "0xa4b1",
      chainName: "Arbitrum One",
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: ["https://arb1.arbitrum.io/rpc"],
      blockExplorerUrls: ["https://arbiscan.io"],
    },
    10: {
      chainId: "0xa",
      chainName: "Optimism",
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: ["https://mainnet.optimism.io"],
      blockExplorerUrls: ["https://optimistic.etherscan.io"],
    },
    43114: {
      chainId: "0xa86a",
      chainName: "Avalanche",
      nativeCurrency: {
        name: "AVAX",
        symbol: "AVAX",
        decimals: 18,
      },
      rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
      blockExplorerUrls: ["https://snowtrace.io"],
    },
  };

  return chains[chainId];
}

// Extend window type for ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}