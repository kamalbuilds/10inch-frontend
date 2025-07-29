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
import { fusionPlusService } from "@/services/fusionPlusService";
import {
  SUPPORTED_CHAINS,
  DEFAULT_TOKENS,
  NON_EVM_CHAINS,
  type Token,
} from "@/config/tokens";

export default function SwapInterface() {
  const { isConnected, address, chainId, signer } = useWallet();
  
  // Helper function to get token symbol from address
  const getTokenSymbol = (tokenAddress: string, chainId: string | number): string => {
    const tokens = getTokensForChain(chainId);
    const token = tokens.find(t => t.address === tokenAddress || t.symbol === tokenAddress);
    return token?.symbol || tokenAddress;
  };
  const [fromChain, setFromChain] = useState<string | number>(1); // Ethereum
  const [toChain, setToChain] = useState<string | number>(137); // Polygon
  const [fromToken, setFromToken] = useState<string>("ETH");
  const [toToken, setToToken] = useState<string>("MATIC");
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

          const quote = await fusionPlusService.getSwapQuote({
            fromChain: fromChainConfig.name.toUpperCase().replace(" ", "_"),
            toChain: toChainConfig.name.toUpperCase().replace(" ", "_"),
            fromToken,
            toToken,
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
    if (!isConnected || !signer) {
      setSwapError("Please connect your wallet first");
      return;
    }

    const fromChainConfig = SUPPORTED_CHAINS.find(c => c.id === fromChain);
    const toChainConfig = SUPPORTED_CHAINS.find(c => c.id === toChain);
    
    if (!fromChainConfig || !toChainConfig) {
      setSwapError("Invalid chain selection");
      return;
    }

    // Check if non-EVM chain requires private key
    if (fromChainConfig.type !== 'EVM' && !nonEvmPrivateKey) {
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
          recipient: recipientAddress || address!,
          senderAddress: address!,
          privateKey: fromChainConfig.type !== 'EVM' ? nonEvmPrivateKey : undefined,
        },
        fromChainConfig.type === 'EVM' ? signer : undefined
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

  const getTokensForChain = (chainId: string | number): Token[] => {
    // For string chain IDs (non-EVM), convert to lowercase
    const lookupId = typeof chainId === 'string' ? chainId.toLowerCase() : chainId;
    return DEFAULT_TOKENS[lookupId] || [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a192f] to-[#1e2a47] p-4">
      <div className="max-w-4xl mx-auto pt-10">
        <motion.div
          className="flex justify-end mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <WalletConnect />
        </motion.div>
        
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">
            Fusion Plus Swap
          </h1>
          <p className="text-gray-400 text-lg">
            Cross-chain swaps powered by atomic swaps and HTLC technology
          </p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-[#1e2a47] to-[#0a192f] rounded-2xl shadow-xl"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <CardHeader>
            <motion.div
              className="flex items-center justify-between"
              variants={item}
            >
              <CardTitle className="text-white">Swap Tokens</CardTitle>
              <div className="flex gap-2">
                <Badge 
                  variant={swapMode === "simple" ? "default" : "secondary"}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                >
                  Simple Mode
                </Badge>
                <Badge 
                  variant={swapMode === "fusion" ? "default" : "secondary"}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                >
                  Fusion+ Mode
                </Badge>
              </div>
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="fusion" onValueChange={(v) => setSwapMode(v as any)}>
              <TabsList className="grid w-full grid-cols-2 bg-[#0a192f]">
                <TabsTrigger 
                  value="simple" 
                  className="text-white hover:bg-[#1e2a47]"
                >
                  Simple Swap
                </TabsTrigger>
                <TabsTrigger 
                  value="fusion" 
                  className="text-white hover:bg-[#1e2a47]"
                >
                  Fusion+ Swap
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="simple" className="mt-6">
                <p className="text-gray-400 mb-4">
                  Direct token swaps within the same blockchain
                </p>
              </TabsContent>
              
              <TabsContent value="fusion" className="mt-6">
                <p className="text-gray-400 mb-4">
                  Advanced cross-chain swaps with atomic guarantees
                </p>
              </TabsContent>
            </Tabs>

            {/* From Token */}
            <motion.div
              variants={item}
              className="space-y-4"
            >
              <div className="flex justify-between items-center">
                <Label className="text-gray-400">From</Label>
                <motion.div
                  className="flex gap-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <ChainSelector
                    chains={SUPPORTED_CHAINS}
                    selectedChain={fromChain}
                    onSelect={(chainId) => {
                      setFromChain(chainId);
                      // Reset token selection when chain changes
                      const newTokens = getTokensForChain(chainId);
                      if (newTokens.length > 0) {
                        // Select native token by default
                        const chain = SUPPORTED_CHAINS.find(c => c.id === chainId);
                        if (chain) {
                          setFromToken(chain.nativeCurrency.symbol);
                        }
                      }
                    }}
                    className="bg-[#0a192f] text-white"
                  />
                  
                  <TokenSelector
                    tokens={getTokensForChain(fromChain)}
                    selectedToken={fromToken}
                    onSelect={setFromToken}
                    chainName={SUPPORTED_CHAINS.find(c => c.id === fromChain)?.name || ""}
                    className="bg-[#0a192f] text-white"
                  />
                  
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    className="flex-1 bg-[#0a192f] text-white border-[#1e2a47] focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </motion.div>
              </div>

              {/* Swap Button */}
              <motion.div
                className="flex justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={switchChains}
                  className="rounded-full bg-[#0a192f] hover:bg-[#1e2a47] text-white"
                >
                  <ArrowDownUp className="h-4 w-4" />
                </Button>
              </motion.div>

              <div className="flex justify-between items-center">
                <Label className="text-gray-400">To</Label>
                <motion.div
                  className="flex gap-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <ChainSelector
                    chains={SUPPORTED_CHAINS}
                    selectedChain={toChain}
                    onSelect={(chainId) => {
                      setToChain(chainId);
                      // Reset token selection when chain changes
                      const newTokens = getTokensForChain(chainId);
                      if (newTokens.length > 0) {
                        // Select native token by default
                        const chain = SUPPORTED_CHAINS.find(c => c.id === chainId);
                        if (chain) {
                          setToToken(chain.nativeCurrency.symbol);
                        }
                      }
                    }}
                    className="bg-[#0a192f] text-white"
                  />
                  
                  <TokenSelector
                    tokens={getTokensForChain(toChain)}
                    selectedToken={toToken}
                    onSelect={setToToken}
                    chainName={SUPPORTED_CHAINS.find(c => c.id === toChain)?.name || ""}
                    className="bg-[#0a192f] text-white"
                  />
                  
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={quoteLoading ? "Loading..." : toAmount}
                    className="flex-1 bg-[#0a192f] text-white border-[#1e2a47] focus-visible:ring-2 focus-visible:ring-blue-500"
                    readOnly
                    disabled
                  />
                </motion.div>
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

            {/* Non-EVM Private Key Input */}
            {(() => {
              const fromChainConfig = SUPPORTED_CHAINS.find(c => c.id === fromChain);
              return fromChainConfig?.type !== 'EVM' ? (
                <motion.div variants={item} className="space-y-2">
                  <Label className="text-gray-400">Private Key (Required for {fromChainConfig.name})</Label>
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
            <motion.div
              variants={item}
              className="mt-6"
            >
              <Button
                disabled={!isConnected || !fromAmount || parseFloat(fromAmount) <= 0 || isLoading || quoteLoading}
                onClick={handleSwap}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Swapping...
                  </>
                ) : (
                  "Swap"
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