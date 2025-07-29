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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Search } from "lucide-react";
import { Token } from "@/config/tokens";

interface TokenSelectorProps {
  tokens: Token[];
  selectedToken: string;
  onSelect: (token: string) => void;
  chainName: string;
  className?: string;
}

export default function TokenSelector({
  tokens,
  selectedToken,
  onSelect,
  chainName,
  className,
}: TokenSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredTokens = tokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(search.toLowerCase()) ||
      token.name.toLowerCase().includes(search.toLowerCase())
  );

  const currentToken = tokens.find((t) => t.symbol === selectedToken);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={`w-[120px] justify-between ${className || ''}`}>
          {currentToken ? (
            <>
              <span>{currentToken.symbol}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </>
          ) : (
            <>
              <span>Select</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className={`sm:max-w-[425px] ${className || ''}`}>
        <DialogHeader>
          <DialogTitle>Select a token</DialogTitle>
          <DialogDescription>
            Choose a token on {chainName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select
              value={selectedToken}
              onChange={(e) => onSelect(e.target.value)}
              className={`flex-1 bg-[#1e2a47] text-gray-300 border-[#1e2a47] rounded-md px-3 py-2 focus-visible:ring-blue-500 ${className || ''}`}
            >
              {filteredTokens.map((token) => (
                <option key={token.address} value={token.symbol} className="text-gray-300 bg-[#0a192f]">
                  {token.symbol} - {token.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {filteredTokens.map((token) => (
              <button
                key={token.address}
                onClick={() => {
                  onSelect(token.symbol);
                  setOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-xs font-semibold">
                    {token.symbol.slice(0, 2)}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-sm text-muted-foreground">
                      {token.name}
                    </div>
                  </div>
                </div>
                {selectedToken === token.symbol && (
                  <Badge variant="secondary">Selected</Badge>
                )}
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}