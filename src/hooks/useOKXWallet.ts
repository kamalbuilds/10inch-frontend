"use client";

import { useState, useEffect, useCallback } from "react";
import { getOKXWalletService, OKXWalletService } from "@/services/okxWalletService";
import { OKX_TON_CONNECTION_AND_TRANSACTION_EVENT } from "@okxconnect/tonsdk";

interface UseOKXWalletReturn {
  isConnected: boolean;
  address: string | null;
  chainId: string;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendTransaction: (transaction: any) => Promise<any>;
  isLoading: boolean;
  error: string | null;
}

export function useOKXWallet(): UseOKXWalletReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okxService, setOkxService] = useState<OKXWalletService | null>(null);

  // Initialize OKX wallet service
  useEffect(() => {
    try {
      const service = getOKXWalletService({
        name: "Fusion Plus",
        icon: window.location.origin + "/favicon.ico"
      });
      setOkxService(service);

      // Try to restore connection
      service.restoreConnection().then(() => {
        const account = service.getAccount();
        if (account) {
          setIsConnected(true);
          setAddress(account.address);
        }
      });

      // Set up status change listener
      const unsubscribe = service.onStatusChange((walletInfo) => {
        if (walletInfo) {
          const account = service.getAccount();
          if (account) {
            setIsConnected(true);
            setAddress(account.address);
          }
        } else {
          setIsConnected(false);
          setAddress(null);
        }
      });

      // Set up connection change listener
      const unsubscribeConnection = service.onConnectionChange((connected) => {
        setIsConnected(connected);
        if (!connected) {
          setAddress(null);
        }
      });

      return () => {
        unsubscribe();
        unsubscribeConnection();
      };
    } catch (error) {
      console.error("Failed to initialize OKX wallet:", error);
      setError("Failed to initialize OKX wallet");
    }
  }, []);

  // Set up event listeners for connection events
  useEffect(() => {
    const handleConnectionStarted = () => {
      setIsLoading(true);
      setError(null);
    };

    const handleConnectionCompleted = () => {
      setIsLoading(false);
    };

    const handleConnectionError = (event: CustomEvent) => {
      setIsLoading(false);
      setError(event.detail?.message || "Connection failed");
    };

    const handleTransactionSent = () => {
      setIsLoading(true);
    };

    const handleTransactionSigned = () => {
      setIsLoading(false);
    };

    const handleTransactionFailed = (event: CustomEvent) => {
      setIsLoading(false);
      setError(event.detail?.message || "Transaction failed");
    };

    // Add event listeners
    window.addEventListener(
      OKX_TON_CONNECTION_AND_TRANSACTION_EVENT.OKX_TON_CONNECTION_STARTED,
      handleConnectionStarted as EventListener
    );
    window.addEventListener(
      OKX_TON_CONNECTION_AND_TRANSACTION_EVENT.OKX_TON_CONNECTION_COMPLETED,
      handleConnectionCompleted as EventListener
    );
    window.addEventListener(
      OKX_TON_CONNECTION_AND_TRANSACTION_EVENT.OKX_TON_CONNECTION_ERROR,
      handleConnectionError as EventListener
    );
    window.addEventListener(
      OKX_TON_CONNECTION_AND_TRANSACTION_EVENT.OKX_TON_TRANSACTION_SENT_FOR_SIGNATURE,
      handleTransactionSent as EventListener
    );
    window.addEventListener(
      OKX_TON_CONNECTION_AND_TRANSACTION_EVENT.OKX_TON_TRANSACTION_SIGNED,
      handleTransactionSigned as EventListener
    );
    window.addEventListener(
      OKX_TON_CONNECTION_AND_TRANSACTION_EVENT.OKX_TON_TRANSACTION_SIGNING_FAILED,
      handleTransactionFailed as EventListener
    );

    // Cleanup
    return () => {
      window.removeEventListener(
        OKX_TON_CONNECTION_AND_TRANSACTION_EVENT.OKX_TON_CONNECTION_STARTED,
        handleConnectionStarted as EventListener
      );
      window.removeEventListener(
        OKX_TON_CONNECTION_AND_TRANSACTION_EVENT.OKX_TON_CONNECTION_COMPLETED,
        handleConnectionCompleted as EventListener
      );
      window.removeEventListener(
        OKX_TON_CONNECTION_AND_TRANSACTION_EVENT.OKX_TON_CONNECTION_ERROR,
        handleConnectionError as EventListener
      );
      window.removeEventListener(
        OKX_TON_CONNECTION_AND_TRANSACTION_EVENT.OKX_TON_TRANSACTION_SENT_FOR_SIGNATURE,
        handleTransactionSent as EventListener
      );
      window.removeEventListener(
        OKX_TON_CONNECTION_AND_TRANSACTION_EVENT.OKX_TON_TRANSACTION_SIGNED,
        handleTransactionSigned as EventListener
      );
      window.removeEventListener(
        OKX_TON_CONNECTION_AND_TRANSACTION_EVENT.OKX_TON_TRANSACTION_SIGNING_FAILED,
        handleTransactionFailed as EventListener
      );
    };
  }, []);

  const connect = useCallback(async () => {
    if (!okxService) {
      setError("OKX wallet service not initialized");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Detect if we're in a mobile environment
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

      await okxService.connect({
        openUniversalLink: isMobile,
        tonProof: "fusion-plus-swap", // Optional signature message
      });

      const account = okxService.getAccount();
      if (account) {
        setIsConnected(true);
        setAddress(account.address);
      }
    } catch (error: any) {
      console.error("Failed to connect:", error);
      setError(error.message || "Failed to connect to OKX wallet");
    } finally {
      setIsLoading(false);
    }
  }, [okxService]);

  const disconnect = useCallback(async () => {
    if (!okxService) return;

    try {
      setIsLoading(true);
      await okxService.disconnect();
      setIsConnected(false);
      setAddress(null);
      setError(null);
    } catch (error: any) {
      console.error("Failed to disconnect:", error);
      setError(error.message || "Failed to disconnect");
    } finally {
      setIsLoading(false);
    }
  }, [okxService]);

  const sendTransaction = useCallback(async (transaction: any) => {
    if (!okxService || !isConnected) {
      throw new Error("Wallet not connected");
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const result = await okxService.sendTransaction(transaction);
      return result;
    } catch (error: any) {
      console.error("Transaction failed:", error);
      setError(error.message || "Transaction failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [okxService, isConnected]);

  return {
    isConnected,
    address,
    chainId: "ton", // TON chain ID
    connect,
    disconnect,
    sendTransaction,
    isLoading,
    error,
  };
}