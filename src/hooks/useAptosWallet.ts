"use client";

import { useState, useEffect, useCallback } from "react";
import { getOKXAptosService, OKXAptosService } from "@/services/okxAptosService";

interface UseAptosWalletReturn {
  isConnected: boolean;
  address: string | null;
  chainId: string;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signAndSubmitTransaction: (payload: any) => Promise<any>;
  isLoading: boolean;
  error: string | null;
}

export function useAptosWallet(): UseAptosWalletReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aptosService, setAptosService] = useState<OKXAptosService | null>(null);

  // Initialize Aptos wallet service
  useEffect(() => {
    try {
      const service = getOKXAptosService({
        name: "Fusion Plus",
        icon: window.location.origin + "/favicon.ico"
      });
      setAptosService(service);

      // Check if already connected
      const account = service.getAccount();
      if (account) {
        setIsConnected(true);
        setAddress(account.address);
      }

      // Set up connection change listener
      const unsubscribe = service.onConnectionChange((connected) => {
        setIsConnected(connected);
        if (connected) {
          const acc = service.getAccount();
          setAddress(acc?.address || null);
        } else {
          setAddress(null);
        }
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error("Failed to initialize Aptos wallet:", error);
      setError("Failed to initialize Aptos wallet");
    }
  }, []);

  const connect = useCallback(async () => {
    if (!aptosService) {
      setError("Aptos wallet service not initialized");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const account = await aptosService.connect();
      setIsConnected(true);
      setAddress(account.address);
    } catch (error: any) {
      console.error("Failed to connect:", error);
      setError(error.message || "Failed to connect to OKX wallet");
    } finally {
      setIsLoading(false);
    }
  }, [aptosService]);

  const disconnect = useCallback(async () => {
    if (!aptosService) return;

    try {
      setIsLoading(true);
      await aptosService.disconnect();
      setIsConnected(false);
      setAddress(null);
      setError(null);
    } catch (error: any) {
      console.error("Failed to disconnect:", error);
      setError(error.message || "Failed to disconnect");
    } finally {
      setIsLoading(false);
    }
  }, [aptosService]);

  const signAndSubmitTransaction = useCallback(async (payload: any) => {
    if (!aptosService || !isConnected) {
      throw new Error("Wallet not connected");
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const result = await aptosService.signAndSubmitTransaction(payload);
      return result;
    } catch (error: any) {
      console.error("Transaction failed:", error);
      setError(error.message || "Transaction failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [aptosService, isConnected]);

  return {
    isConnected,
    address,
    chainId: "aptos", // Aptos chain ID
    connect,
    disconnect,
    signAndSubmitTransaction,
    isLoading,
    error,
  };
}