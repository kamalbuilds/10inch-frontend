"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Wallet, Copy, LogOut, ChevronDown } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { SUPPORTED_CHAINS } from "@/config/tokens";

export function WalletConnect() {
  const { isConnected, address, chainId, balance, connect, disconnect, switchChain } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
    }
  };

  const currentChain = SUPPORTED_CHAINS.find((c) => c.id === chainId);

  if (!isConnected) {
    return (
      <Button onClick={connect} className="gap-2">
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {currentChain && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <div className="w-4 h-4 bg-primary/20 rounded-full" />
              {currentChain.name}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Switch Network</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {SUPPORTED_CHAINS.map((chain) => (
              <DropdownMenuItem
                key={chain.id}
                onClick={() => switchChain(Number(chain.id))}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary/20 rounded-full" />
                  <span>{chain.name}</span>
                  {chain.id === chainId && (
                    <Badge variant="secondary" className="ml-auto">
                      Active
                    </Badge>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Wallet className="h-4 w-4" />
            {formatAddress(address!)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
            <Copy className="mr-2 h-4 w-4" />
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="px-2 py-1.5 text-sm">
            <div className="text-muted-foreground">Balance</div>
            <div className="font-medium">{balance ? `${parseFloat(balance).toFixed(4)} ETH` : "0 ETH"}</div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={disconnect} className="cursor-pointer text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}