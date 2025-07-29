"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { ChainConfig } from "@/config/tokens";

interface ChainSelectorProps {
  chains: ChainConfig[];
  selectedChain: number | string;
  onSelect: (chainId: number | string) => void;
  label?: string;
  className?: string;
}

export default function ChainSelector({
  chains,
  selectedChain,
  onSelect,
  label = "Select Chain",
  className,
}: ChainSelectorProps) {
  const [open, setOpen] = useState(false);
  
  const currentChain = chains.find((c) => c.id === selectedChain);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={`w-[180px] justify-between ${className || ''}`}>
          {currentChain ? (
            <>
              <div className="flex items-center gap-2">
                {currentChain.logoURI ? (
                  <img 
                    src={currentChain.logoURI} 
                    alt={currentChain.name} 
                    className="w-5 h-5 rounded-full"
                  />
                ) : (
                  <div className="w-5 h-5 bg-muted rounded-full" />
                )}
                <span>{currentChain.name}</span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </>
          ) : (
            <>
              <span>{label}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className={`sm:max-w-[425px] ${className || ''}`}>
        <DialogHeader>
          <DialogTitle>Select a network</DialogTitle>
          <DialogDescription>
            Choose the blockchain network for your swap
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 mt-4 max-h-[400px] overflow-y-auto">
          {chains.map((chain) => (
            <button
              key={chain.id}
              onClick={() => {
                onSelect(chain.id);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-muted">
                  {chain.logoURI ? (
                    <img 
                      src={chain.logoURI} 
                      alt={chain.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-primary/20 rounded-full" />
                  )}
                </div>
                <div className="text-left">
                  <div className="font-medium">{chain.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {chain.nativeCurrency.symbol}
                    {chain.type && chain.type !== 'EVM' && (
                      <span className="ml-2 text-xs text-blue-400">({chain.type})</span>
                    )}
                  </div>
                </div>
              </div>
              {selectedChain === chain.id && (
                <Badge variant="secondary">Selected</Badge>
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}