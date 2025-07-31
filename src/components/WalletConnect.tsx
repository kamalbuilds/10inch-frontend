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
import { useOKXWallet } from "@/hooks/useOKXWallet";
import { useAptosWallet } from "@/hooks/useAptosWallet";
import { useState } from "react";

export function WalletConnect() {
  const { isConnected, address, chainId, balance, connect, disconnect, switchChain } = useWallet();
  const { 
    isConnected: isOKXConnected, 
    address: okxAddress, 
    connect: connectOKX, 
    disconnect: disconnectOKX 
  } = useOKXWallet();
  const {
    isConnected: isAptosConnected,
    address: aptosAddress,
    connect: connectAptos,
    disconnect: disconnectAptos
  } = useAptosWallet();
  const [showWalletOptions, setShowWalletOptions] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = () => {
    const addressToCopy = address || okxAddress || aptosAddress;
    if (addressToCopy) {
      navigator.clipboard.writeText(addressToCopy);
    }
  };

  const currentChain = SUPPORTED_CHAINS.find((c) => c.id === chainId);

  const handleConnect = async (walletType: 'metamask' | 'okx-ton' | 'okx-aptos') => {
    if (walletType === 'metamask') {
      await connect();
    } else if (walletType === 'okx-ton') {
      await connectOKX();
    } else if (walletType === 'okx-aptos') {
      await connectAptos();
    }
    setShowWalletOptions(false);
  };

  if (!isConnected && !isOKXConnected && !isAptosConnected) {
    return (
      <DropdownMenu open={showWalletOptions} onOpenChange={setShowWalletOptions}>
        <DropdownMenuTrigger asChild>
          <Button className="gap-2">
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Choose Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => handleConnect('metamask')}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-500 rounded-md" />
              <span>MetaMask</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleConnect('okx-ton')}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-black rounded-md" />
              <span>OKX Wallet (TON)</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleConnect('okx-aptos')}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-black rounded-md" />
              <span>OKX Wallet (Aptos)</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const isEVMWallet = isConnected && !isOKXConnected && !isAptosConnected;
  const activeAddress = address || okxAddress || aptosAddress;
  const walletType = isOKXConnected ? 'OKX (TON)' : isAptosConnected ? 'OKX (Aptos)' : 'MetaMask';

  return (
    <div className="flex items-center gap-2">
      {isEVMWallet && currentChain && (
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
            {SUPPORTED_CHAINS.filter(chain => typeof chain.id === 'number').map((chain) => (
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

      {isOKXConnected && (
        <Badge variant="secondary" className="gap-1">
          <div className="w-4 h-4 bg-blue-500 rounded-full" />
          TON Network
        </Badge>
      )}

      {isAptosConnected && (
        <Badge variant="secondary" className="gap-1">
          <div className="w-4 h-4 bg-red-500 rounded-full" />
          Aptos Network
        </Badge>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Wallet className="h-4 w-4" />
            {formatAddress(activeAddress!)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>
            {walletType} Account
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
            <Copy className="mr-2 h-4 w-4" />
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {isEVMWallet && (
            <>
              <div className="px-2 py-1.5 text-sm">
                <div className="text-muted-foreground">Balance</div>
                <div className="font-medium">{balance ? `${parseFloat(balance).toFixed(4)} ETH` : "0 ETH"}</div>
              </div>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem 
            onClick={isOKXConnected ? disconnectOKX : isAptosConnected ? disconnectAptos : disconnect} 
            className="cursor-pointer text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}