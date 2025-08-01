"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownUp, Loader2 } from "lucide-react";
import ChainSelector from "@/components/ChainSelector";
import TokenSelector from "@/components/TokenSelector";
import { WalletConnect } from "@/components/WalletConnect";
import { useWallet } from "@/hooks/useWallet";
import { useOKXWallet } from "@/hooks/useOKXWallet";
import { useAptosWallet } from "@/hooks/useAptosWallet";
import { fusionPlusService } from "@/services/fusionPlusService";
import { getOKXAptosService } from "@/services/okxAptosService";
import { getOKXWalletService } from "@/services/okxWalletService";
import {
  SUPPORTED_CHAINS,
  DEFAULT_TOKENS,
  NON_EVM_CHAINS,
  type Token,
} from "@/config/tokens";

export default function SwapInterface() {
  const { isConnected, address, chainId, signer } = useWallet();
  const {
    isConnected: isOKXConnected,
    address: okxAddress,
    chainId: okxChainId
  } = useOKXWallet();
  const {
    isConnected: isAptosConnected,
    address: aptosAddress,
    chainId: aptosChainId
  } = useAptosWallet();

  const [fromChain, setFromChain] = useState<string | number>(1); // Ethereum
  const [toChain, setToChain] = useState<string | number>(137); // Polygon
  const [fromToken, setFromToken] = useState<string>("0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"); // Native ETH
  const [toToken, setToToken] = useState<string>("0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"); // Native token
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [swapMode, setSwapMode] = useState<"simple" | "fusion">("fusion");
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [estimatedGas, setEstimatedGas] = useState<string>("");
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const [swapRate, setSwapRate] = useState<string>("");
  const [nonEvmPrivateKey, setNonEvmPrivateKey] = useState<string>("");
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [swapError, setSwapError] = useState<string>("");
  const [chainTokens, setChainTokens] = useState<Record<string | number, Token[]>>({});
  const [loadingTokens, setLoadingTokens] = useState<Record<string | number, boolean>>({});

  // Helper function to get token symbol from address
  const getTokenSymbol = (tokenAddress: string, chainId: string | number): string => {
    const tokens = chainTokens[chainId] || [];
    const token = tokens.find((t: Token) => t.address === tokenAddress || t.symbol === tokenAddress);
    return token?.symbol || tokenAddress;
  };

  // Get tokens for a chain
  const getTokensForChain = async (chainId: string | number): Promise<Token[]> => {
    if (chainTokens[chainId]) {
      return chainTokens[chainId];
    }

    setLoadingTokens(prev => ({ ...prev, [chainId]: true }));

    try {
      const tokens = await fusionPlusService.getTokensForChain(chainId);
      console.log("tokens >>>", tokens);
      setChainTokens(prev => ({ ...prev, [chainId]: tokens }));
      return tokens;
    } catch (error) {
      console.error('Error loading tokens:', error);
      const lookupId = typeof chainId === 'string' ? chainId.toLowerCase() : chainId;
      return DEFAULT_TOKENS[lookupId] || [];
    } finally {
      setLoadingTokens(prev => ({ ...prev, [chainId]: false }));
    }
  };

  // Add animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Load initial tokens
  useEffect(() => {
    getTokensForChain(fromChain);
    getTokensForChain(toChain);
  }, []);

  // Set wallet services when connected
  useEffect(() => {
    try {
      if (isOKXConnected) {
        const okxService = getOKXWalletService({
          name: "Fusion Plus",
          icon: window.location.origin + "/favicon.ico"
        });
        fusionPlusService.setOKXWalletService(okxService);
      }

      if (isAptosConnected) {
        const aptosService = getOKXAptosService({
          name: "Fusion Plus",
          icon: window.location.origin + "/favicon.ico",
          network: (process.env.NEXT_PUBLIC_APTOS_NETWORK as 'mainnet' | 'testnet') || "testnet"
        });
        fusionPlusService.setOKXAptosService(aptosService);
      }
    } catch (error) {
      console.error("Failed to set wallet services:", error);
    }
  }, [isOKXConnected, isAptosConnected]);

  // Debug wallet state
  useEffect(() => {
    console.log("Wallet state updated:", { isConnected, address, signer: !!signer });
  }, [isConnected, address, signer]);

  // Update quote when amount changes
  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0) {
      const updateQuote = async () => {
        setQuoteLoading(true);
        setSwapError("");
        try {
          const fromChainConfig = SUPPORTED_CHAINS.find(c => c.id === fromChain);
          const toChainConfig = SUPPORTED_CHAINS.find(c => c.id === toChain);

          if (!fromChainConfig || !toChainConfig) {
            throw new Error("Invalid chain selection");
          }

          // Convert chain names for API
          let fromChainName = fromChainConfig.name.toUpperCase();
          let toChainName = toChainConfig.name.toUpperCase();

          // Special handling for chain names
          if (fromChainName === 'BNB SMART CHAIN') fromChainName = 'BSC';
          if (toChainName === 'BNB SMART CHAIN') toChainName = 'BSC';

          // For non-EVM chains, use token symbols instead of addresses
          let fromTokenParam = fromToken;
          let toTokenParam = toToken;

          if (fromChainConfig.type !== 'EVM') {
            // Get token symbol from the token data
            const fromTokenData = chainTokens[fromChain]?.find(t => t.address === fromToken || t.symbol === fromToken);
            fromTokenParam = fromTokenData?.symbol || fromToken;
          }

          if (toChainConfig.type !== 'EVM') {
            // Get token symbol from the token data
            const toTokenData = chainTokens[toChain]?.find(t => t.address === toToken || t.symbol === toToken);
            toTokenParam = toTokenData?.symbol || toToken;
          }

          const quote = await fusionPlusService.getSwapQuote({
            fromChain: fromChainName,
            toChain: toChainName,
            fromToken: fromTokenParam,
            toToken: toTokenParam,
            amount: fromAmount,
          });
          setToAmount(quote.toAmount);
          setEstimatedGas(quote.estimatedGas);
          setEstimatedTime(quote.estimatedTime);
          setSwapRate(quote.rate);
        } catch (error) {
          console.error("Error updating quote:", error);
          setSwapError("Failed to get quote. Please try again.");
        } finally {
          setQuoteLoading(false);
        }
      };

      const debounceTimer = setTimeout(updateQuote, 500);
      return () => clearTimeout(debounceTimer);
    } else {
      setToAmount("");
      setEstimatedGas("");
      setEstimatedTime(0);
      setSwapRate("");
    }
  }, [fromAmount, fromChain, toChain, fromToken, toToken]);

  const handleSwap = async () => {
    // Determine active wallet
    const activeAddress = address || okxAddress || aptosAddress;
    const activeChainId = chainId || okxChainId || aptosChainId;
    const isAnyWalletConnected = isConnected || isOKXConnected || isAptosConnected;

    console.log("Swap button clicked:", { isConnected, isOKXConnected, isAptosConnected, signer, activeAddress });

    const fromChainConfig = SUPPORTED_CHAINS.find(c => c.id === fromChain);
    const toChainConfig = SUPPORTED_CHAINS.find(c => c.id === toChain);

    // For EVM chains, check wallet connection
    if (fromChainConfig?.type === 'EVM' && (!isConnected || !signer)) {
      setSwapError("Please connect your wallet first");
      return;
    }

    // For TON chain, check OKX wallet connection
    if (fromChainConfig?.type === 'TON' && !isOKXConnected) {
      setSwapError("Please connect your OKX wallet for TON transactions");
      return;
    }

    // For Aptos chain, check OKX wallet connection
    if (fromChainConfig?.type === 'APTOS' && !isAptosConnected) {
      setSwapError("Please connect your OKX wallet for Aptos transactions");
      return;
    }

    // For other non-EVM chains, check if we have an address (even if no signer)
    if (fromChainConfig?.type !== 'EVM' && fromChainConfig?.type !== 'TON' && fromChainConfig?.type !== 'APTOS' && !activeAddress && !recipientAddress) {
      setSwapError("Please connect your wallet or provide a recipient address");
      return;
    }

    if (!fromChainConfig || !toChainConfig) {
      setSwapError("Invalid chain selection");
      return;
    }

    // Check if non-EVM chain (except TON and Aptos) requires private key
    if (fromChainConfig.type !== 'EVM' && fromChainConfig.type !== 'TON' && fromChainConfig.type !== 'APTOS' && !nonEvmPrivateKey) {
      setSwapError(`Private key required for ${fromChainConfig.name} transactions`);
      return;
    }

    setIsLoading(true);
    setSwapError("");
    try {
      const swapId = await fusionPlusService.executeSwap(
        {
          fromChain: fromChainConfig.name.toUpperCase().replace(" ", "_"),
          toChain: toChainConfig.name.toUpperCase().replace(" ", "_"),
          fromToken,
          toToken,
          amount: fromAmount,
          recipient: recipientAddress || activeAddress!,
          senderAddress: activeAddress!,
          privateKey: fromChainConfig.type !== 'EVM' && fromChainConfig.type !== 'TON' && fromChainConfig.type !== 'APTOS' ? nonEvmPrivateKey : undefined,
        },
        fromChainConfig.type === 'EVM' ? signer || undefined : undefined
      );

      alert(`Swap initiated! ID: ${swapId}`);
      // Reset form
      setFromAmount("");
      setToAmount("");
      setNonEvmPrivateKey("");
    } catch (error: any) {
      console.error("Swap failed:", error);
      setSwapError(error.message || "Swap failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const switchChains = () => {
    setFromChain(toChain);
    setToChain(fromChain);
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#0a192f] p-4">
      <div className="w-full max-w-2xl">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="backdrop-blur-md bg-[#1e2a47]/80 rounded-2xl shadow-2xl border border-[#2a3f5f] overflow-hidden"
        >
          <CardHeader className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-b border-[#2a3f5f]">
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Fusion+ Swap
              </CardTitle>
              <WalletConnect />
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Swap Mode Tabs */}
            <motion.div variants={item}>
              <Tabs value={swapMode} onValueChange={(v) => setSwapMode(v as "simple" | "fusion")}>
                <TabsList className="grid w-full grid-cols-2 bg-[#1e2a47]">
                  <TabsTrigger value="simple" className="data-[state=active]:bg-blue-600">
                    Simple Swap
                  </TabsTrigger>
                  <TabsTrigger value="fusion" className="data-[state=active]:bg-cyan-600">
                    Fusion+ Cross-Chain
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </motion.div>

            {/* From Section */}
            <motion.div variants={item} className="space-y-4">
              <div className="bg-[#1e2a47]/50 backdrop-blur rounded-lg p-4 border border-[#2a3f5f]">
                <Label className="text-gray-400 mb-2">From</Label>
                <div className="flex gap-3">
                  <ChainSelector
                    chains={SUPPORTED_CHAINS}
                    selectedChain={fromChain}
                    onSelect={async (chainId) => {
                      setFromChain(chainId);
                      await getTokensForChain(chainId);
                      setFromToken('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
                    }}
                    className="bg-[#0a192f] text-white"
                  />
                  <TokenSelector
                    tokens={chainTokens[fromChain] || []}
                    selectedToken={fromToken}
                    onSelect={setFromToken}
                    chainName={SUPPORTED_CHAINS.find(c => c.id === fromChain)?.name || ""}
                    className="bg-[#0a192f] text-white"
                    loading={loadingTokens[fromChain]}
                  />
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <Input
                    placeholder="0.00"
                    value={fromAmount}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow numbers, decimals, and empty string
                      if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        setFromAmount(value);
                      }
                    }}
                    className="flex-1 bg-[#0a192f] text-white border-[#1e2a47] focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>
              </div>
            </motion.div>

            {/* Switch Button */}
            <motion.div variants={item} className="flex justify-center">
              <Button
                onClick={switchChains}
                variant="ghost"
                size="icon"
                className="rounded-full bg-[#1e2a47] hover:bg-[#2a3f5f] text-white"
              >
                <ArrowDownUp className="h-5 w-5" />
              </Button>
            </motion.div>

            {/* To Section */}
            <motion.div variants={item} className="space-y-4">
              <div className="bg-[#1e2a47]/50 backdrop-blur rounded-lg p-4 border border-[#2a3f5f]">
                <Label className="text-gray-400 mb-2">To</Label>
                <div className="flex gap-3">
                  <ChainSelector
                    chains={SUPPORTED_CHAINS}
                    selectedChain={toChain}
                    onSelect={async (chainId) => {
                      setToChain(chainId);
                      // Load tokens for the new chain
                      await getTokensForChain(chainId);
                      // Select native token by default
                      setToToken('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
                    }}
                    className="bg-[#0a192f] text-white"
                  />
                  <TokenSelector
                    tokens={chainTokens[toChain] || []}
                    selectedToken={toToken}
                    onSelect={setToToken}
                    chainName={SUPPORTED_CHAINS.find(c => c.id === toChain)?.name || ""}
                    className="bg-[#0a192f] text-white"
                    loading={loadingTokens[toChain]}
                  />
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <Input
                    placeholder="0.00"
                    value={quoteLoading ? "Loading..." : toAmount}
                    className="flex-1 bg-[#0a192f] text-white border-[#1e2a47] focus-visible:ring-2 focus-visible:ring-blue-500"
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </motion.div>

            {/* Swap Details */}
            {fromAmount && parseFloat(fromAmount) > 0 && !quoteLoading && (
              <motion.div
                variants={item}
                className="bg-[#1e2a47]/50 backdrop-blur rounded-lg p-4 space-y-2 border border-[#2a3f5f]"
              >
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Rate</span>
                  <span className="text-gray-300">
                    1 {getTokenSymbol(fromToken, fromChain)} = {swapRate || "1"} {getTokenSymbol(toToken, toChain)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Network Fee</span>
                  <span className="text-gray-300">~{estimatedGas || "0.001"} ETH</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Est. Time</span>
                  <span className="text-gray-300">~{Math.ceil((estimatedTime || 300) / 60)} minutes</span>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {swapError && (
              <motion.div
                variants={item}
                className="bg-red-500/10 border border-red-500/20 rounded-lg p-3"
              >
                <p className="text-red-400 text-sm">{swapError}</p>
              </motion.div>
            )}

            {/* Non-EVM Private Key Input (excluding TON and Aptos) */}
            {(() => {
              const fromChainConfig = SUPPORTED_CHAINS.find(c => c.id === fromChain);
              return fromChainConfig?.type !== 'EVM' && fromChainConfig?.type !== 'TON' && fromChainConfig?.type !== 'APTOS' ? (
                <motion.div variants={item} className="space-y-2">
                  <Label className="text-gray-400">Private Key (Required for {fromChainConfig?.name})</Label>
                  <Input
                    type="password"
                    placeholder="Enter your private key"
                    value={nonEvmPrivateKey}
                    onChange={(e) => setNonEvmPrivateKey(e.target.value)}
                    className="bg-[#0a192f] text-white border-[#1e2a47] focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500">Your private key is never stored and only used for this transaction</p>
                </motion.div>
              ) : null;
            })()}

            {/* Recipient Address (Optional) */}
            {swapMode === "fusion" && (
              <motion.div variants={item} className="space-y-2">
                <Label className="text-gray-400">Recipient Address (Optional)</Label>
                <Input
                  placeholder={`Enter ${SUPPORTED_CHAINS.find(c => c.id === toChain)?.name || ''} address`}
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="bg-[#0a192f] text-white border-[#1e2a47] focus-visible:ring-2 focus-visible:ring-blue-500"
                />
                <p className="text-xs text-gray-500">Leave empty to send to your connected wallet</p>
              </motion.div>
            )}

            {/* Swap Button */}
            <motion.div variants={item}>
              <Button
                disabled={(() => {
                  const fromChainConfig = SUPPORTED_CHAINS.find(c => c.id === fromChain);

                  // Check if wallet is connected based on chain type
                  const isWalletConnected = fromChainConfig?.type === 'TON' ? isOKXConnected :
                    fromChainConfig?.type === 'APTOS' ? isAptosConnected :
                      isConnected; // For EVM and other chains

                  const conditions = {
                    notConnected: !isWalletConnected,
                    noFromAmount: !fromAmount,
                    invalidAmount: parseFloat(fromAmount) <= 0,
                    isLoading: isLoading,
                    quoteLoading: quoteLoading
                  };

                  const isDisabled = !isWalletConnected ||
                    !fromAmount ||
                    parseFloat(fromAmount) <= 0 ||
                    isLoading ||
                    quoteLoading;

                  const walletStates = {
                    evmConnected: isConnected,
                    okxTonConnected: isOKXConnected,
                    okxAptosConnected: isAptosConnected,
                    fromChainType: fromChainConfig?.type,
                    fromChainId: fromChain
                  };

                  console.log('Swap Button Disabled Debug:', {
                    isDisabled,
                    conditions,
                    walletStates,
                    fromAmount,
                    parsedAmount: fromAmount ? parseFloat(fromAmount) : 0,
                    isWalletConnected,
                    isLoading,
                    quoteLoading
                  });

                  return isDisabled;
                })()}
                onClick={handleSwap}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : !isConnected && SUPPORTED_CHAINS.find(c => c.id === fromChain)?.type === 'EVM' ? (
                  "Connect Wallet"
                ) : !isOKXConnected && SUPPORTED_CHAINS.find(c => c.id === fromChain)?.type === 'TON' ? (
                  "Connect OKX Wallet"
                ) : !isAptosConnected && SUPPORTED_CHAINS.find(c => c.id === fromChain)?.type === 'APTOS' ? (
                  "Connect OKX Wallet"
                ) : (
                  swapMode === "simple" ? "Swap Tokens" : "Cross-Chain Swap"
                )}
              </Button>
            </motion.div>

            {/* Non-EVM Chains Info */}
            <motion.div
              variants={item}
              className="border-t border-[#2a3f5f] pt-4"
            >
              <p className="text-sm text-gray-400 mb-3">
                Supported non-EVM chains:
              </p>
              <div className="flex gap-2 flex-wrap">
                {SUPPORTED_CHAINS.filter(chain => chain.type && chain.type !== 'EVM').map((chain) => (
                  <Badge
                    key={chain.id}
                    variant="outline"
                    className="border-[#2a3f5f] text-gray-300 hover:bg-[#1e2a47] transition-colors"
                  >
                    <img
                      src={chain.logoURI}
                      alt={chain.name}
                      className="w-4 h-4 mr-1 rounded-full"
                    />
                    {chain.name}
                  </Badge>
                ))}
              </div>
            </motion.div>
          </CardContent>
        </motion.div>
      </div>
    </div>
  );
}