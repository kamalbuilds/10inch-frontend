"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownUp, Settings, Info, Loader2 } from "lucide-react";
import { ChainSelector } from "@/components/ChainSelector";
import { TokenSelector } from "@/components/TokenSelector";
import {
  SUPPORTED_CHAINS,
  DEFAULT_TOKENS,
  NON_EVM_CHAINS,
  type Token,
  type ChainConfig,
} from "@/config/tokens";

export default function SwapInterface() {
  const [fromChain, setFromChain] = useState<number>(1);
  const [toChain, setToChain] = useState<number>(137);
  const [fromToken, setFromToken] = useState<string>("USDC");
  const [toToken, setToToken] = useState<string>("USDC");
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [swapMode, setSwapMode] = useState<"simple" | "fusion">("fusion");

  const handleSwap = async () => {
    setIsLoading(true);
    // TODO: Implement swap logic
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-2xl mx-auto pt-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Fusion Plus Swap</h1>
          <p className="text-muted-foreground">
            Cross-chain swaps powered by atomic swaps and HTLC technology
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Swap Tokens</CardTitle>
              <div className="flex gap-2">
                <Badge variant={swapMode === "simple" ? "default" : "secondary"}>
                  Simple Mode
                </Badge>
                <Badge variant={swapMode === "fusion" ? "default" : "secondary"}>
                  Fusion+ Mode
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="fusion" onValueChange={(v) => setSwapMode(v as any)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="simple">Simple Swap</TabsTrigger>
                <TabsTrigger value="fusion">Fusion+ Swap</TabsTrigger>
              </TabsList>
              
              <TabsContent value="simple" className="mt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Direct token swaps within the same blockchain
                </p>
              </TabsContent>
              
              <TabsContent value="fusion" className="mt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Advanced cross-chain swaps with atomic guarantees
                </p>
              </TabsContent>
            </Tabs>

            {/* From Token */}
            <div className="space-y-2">
              <Label>From</Label>
              <div className="flex gap-2">
                <ChainSelector
                  chains={SUPPORTED_CHAINS}
                  selectedChain={fromChain}
                  onSelect={setFromChain}
                />
                
                <TokenSelector
                  tokens={getTokensForChain(fromChain)}
                  selectedToken={fromToken}
                  onSelect={setFromToken}
                  chainName={SUPPORTED_CHAINS.find(c => c.id === fromChain)?.name || ""}
                />
                
                <Input
                  type="number"
                  placeholder="0.0"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={switchChains}
                className="rounded-full"
              >
                <ArrowDownUp className="h-4 w-4" />
              </Button>
            </div>

            {/* To Token */}
            <div className="space-y-2">
              <Label>To</Label>
              <div className="flex gap-2">
                <Select
                  value={toChain.toString()}
                  onValueChange={(v) => setToChain(Number(v))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_CHAINS.map((chain) => (
                      <SelectItem key={chain.id} value={chain.id.toString()}>
                        <div className="flex items-center gap-2">
                          <span>{chain.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={toToken} onValueChange={setToToken}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getTokensForChain(toChain).map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        {token.symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input
                  type="number"
                  placeholder="0.0"
                  value={toAmount}
                  onChange={(e) => setToAmount(e.target.value)}
                  className="flex-1"
                  disabled
                />
              </div>
            </div>

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
            <Button
              className="w-full"
              size="lg"
              onClick={handleSwap}
              disabled={!fromAmount || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Swap"
              )}
            </Button>

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
        </Card>
      </div>
    </div>
  );
}