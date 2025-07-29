# NON EVM Supported 1inch Fusion + UI

A modern, responsive web interface for cross-chain token swaps powered by Fusion Plus technology.

## Features

- **Cross-Chain Swaps**: Seamlessly swap tokens across multiple EVM and non-EVM chains
- **Modern UI**: Built with Next.js 14, shadcn/ui, and Tailwind CSS
- **Wallet Integration**: Connect with MetaMask and other Web3 wallets
- **Real-time Quotes**: Live price updates and swap estimates
- **Multi-Chain Support**: 
  - EVM: Ethereum, BSC, Polygon, Arbitrum, Optimism, Avalanche
  - Non-EVM: Aptos, Sui, Cosmos, Stellar, Tron, TON

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask or compatible Web3 wallet

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_FUSION_API_URL=http://localhost:3001
```

## Architecture

### Components

- `SwapInterface`: Main swap UI component
- `ChainSelector`: Blockchain network selector
- `TokenSelector`: Token selection dialog
- `WalletConnect`: Web3 wallet connection

### Services

- `fusionPlusService`: Handles swap quotes and execution
- `useWallet`: React hook for wallet state management

### Configuration

- `tokens.ts`: Supported chains and token lists

## Usage

1. **Connect Wallet**: Click "Connect Wallet" to link your Web3 wallet
2. **Select Chains**: Choose source and destination blockchains
3. **Select Tokens**: Pick tokens to swap from and to
4. **Enter Amount**: Input the amount you want to swap
5. **Review Quote**: Check the exchange rate and fees
6. **Execute Swap**: Click "Swap" to initiate the transaction

## Development

### Adding New Chains

Update `src/config/tokens.ts`:

```typescript
export const SUPPORTED_CHAINS: ChainConfig[] = [
  // ... existing chains
  {
    id: YOUR_CHAIN_ID,
    name: "Your Chain",
    network: "your-network",
    nativeCurrency: {
      name: "Token",
      symbol: "TKN",
      decimals: 18,
    },
    rpcUrls: ["https://your-rpc-url"],
    blockExplorerUrls: ["https://your-explorer"],
  },
];
```

### Adding New Tokens

Update `DEFAULT_TOKENS` in `src/config/tokens.ts`:

```typescript
export const DEFAULT_TOKENS: Record<number, Token[]> = {
  YOUR_CHAIN_ID: [
    {
      symbol: "TOKEN",
      name: "Token Name",
      address: "0x...",
      decimals: 18,
      logoURI: "https://...",
      chainId: YOUR_CHAIN_ID,
    },
  ],
};
```

## Integration with Fusion Plus Core

The UI connects to the Fusion Plus backend services for:

- Quote generation
- Swap execution
- Transaction tracking
- Cross-chain messaging

Ensure the Fusion Plus core services are running before using the UI.

## Deploy on Vercel

The easiest way to deploy your Fusion Plus UI is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

MIT
