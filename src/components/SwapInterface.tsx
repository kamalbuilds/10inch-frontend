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
  const [fromChain, setFromChain] = useState<number>(1);
  const [toChain, setToChain] = useState<number>(137);
  const [fromToken, setFromToken] = useState<string>("USDC");
  const [toToken, setToToken] = useState<string>("USDC");
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [swapMode, setSwapMode] = useState<"simple" | "fusion">("fusion");

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
        try {
          const quote = await fusionPlusService.getSwapQuote({
            fromChain,
            toChain,
            fromToken,
            toToken,
            amount: fromAmount,
          });
          setToAmount(quote.toAmount);
        } catch (error) {
          console.error("Error updating quote:", error);
        }
      };
      updateQuote();
    } else {
      setToAmount("");
    }
  }, [fromAmount, fromChain, toChain, fromToken, toToken]);

  const handleSwap = async () => {
    if (!isConnected || !signer) {
      alert("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    try {
      const txHash = await fusionPlusService.executeSwap(
        {
          fromChain,
          toChain,
          fromToken,
          toToken,
          amount: fromAmount,
          recipient: address!,
        },
        signer
      );
      
      alert(`Swap initiated! Transaction: ${txHash}`);
      // Reset form
      setFromAmount("");
      setToAmount("");
    } catch (error) {
      console.error("Swap failed:", error);
      alert("Swap failed. Please try again.");
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

  const getTokensForChain = (chainId: number): Token[] => {
    return DEFAULT_TOKENS[chainId] || [];
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
                    onSelect={setFromChain}
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
                    onSelect={setToChain}
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
                    value={toAmount}
                    onChange={(e) => setToAmount(e.target.value)}
                    className="flex-1 bg-[#0a192f] text-white border-[#1e2a47] focus-visible:ring-2 focus-visible:ring-blue-500"
                    readOnly
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Swap Details */}
            {fromAmount && (
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Rate</span>
                  <span>1 {fromToken} = 1 {toToken}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Network Fee</span>
                  <span>~$2.50</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Est. Time</span>
                  <span>~2-5 minutes</span>
                </div>
              </div>
            )}

            {/* Swap Button */}
            <motion.div
              variants={item}
              className="mt-6"
            >
              <Button
                disabled={!isConnected || !fromAmount || parseFloat(fromAmount) <= 0}
                onClick={handleSwap}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 text-white"
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

            {/* Non-EVM Chains */}
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-3">
                Also supporting non-EVM chains:
              </p>
              <div className="flex gap-2 flex-wrap">
                {Object.values(NON_EVM_CHAINS).map((chain) => (
                  <Badge key={chain.id} variant="outline">
                    {chain.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </motion.div>
      </div>
    </div>
  );
}