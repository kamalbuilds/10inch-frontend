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
  loading?: boolean;
}

export default function TokenSelector({
  tokens,
  selectedToken,
  onSelect,
  chainName,
  className,
  loading,
}: TokenSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredTokens = tokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(search.toLowerCase()) ||
      token.name.toLowerCase().includes(search.toLowerCase()) ||
      token.address.toLowerCase().includes(search.toLowerCase())
  );

  const currentToken = tokens.find((t) => t.symbol === selectedToken || t.address === selectedToken);

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
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or symbol"
              className="pl-10"
            />
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredTokens.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No tokens found
              </div>
            ) : (
              filteredTokens.map((token) => (
                <button
                  key={token.address}
                  onClick={() => {
                    onSelect(token.address);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="w-full flex items-center justify-between p-3 hover:bg-foreground rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                      {token.logoURI ? (
                        <img src={token.logoURI} alt={token.symbol} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-semibold">{token.symbol.slice(0, 2)}</span>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{token.symbol.slice(0, 8)}</div>
                      <div className="text-sm text-muted-foreground">
                        {token.name.slice(0, 10)}
                      </div>
                    </div>
                  </div>
                  {(selectedToken === token.symbol || selectedToken === token.address) && (
                    <Badge variant="secondary">Selected</Badge>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}