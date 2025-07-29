import { ethers } from "ethers";
import axios from "axios";
import { Connection, PublicKey, Keypair, Transaction } from "@solana/web3.js";
import { AptosClient, AptosAccount, HexString } from "aptos";
import { JsonRpcProvider  } from "ethers";
import { connect as nearConnect, keyStores, utils as nearUtils } from "near-api-js";
import { SigningStargateClient } from "@cosmjs/stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { TronWeb } from "tronweb";
import StellarSdk from "stellar-sdk";
import { TransactionBlock } from '@mysten/sui.js/transactions';

export interface SwapParams {
  fromChain: string; // Changed from number to string to support non-numeric chain IDs
  toChain: string;
  fromToken: string;
  toToken: string;
  amount: string;
  slippage?: number;
  recipient?: string;
  senderAddress?: string;
  privateKey?: string; // For non-EVM chains
}

export interface SwapQuote {
  fromAmount: string;
  toAmount: string;
  rate: string;
  estimatedGas: string;
  estimatedTime: number;
  route: string[];
}

export interface SwapStatus {
  swapId: string;
  status: "pending" | "completed" | "failed" | "expired";
  fromChainTx?: string;
  toChainTx?: string;
  timestamp: number;
  secret?: string;
  hashlock?: string;
  expiryTime?: number;
}

// Chain configurations
const CHAIN_CONFIGS = {
  // EVM Chains
  ETHEREUM: { id: 1, rpc: "https://eth.llamarpc.com", type: "EVM" },
  SEPOLIA: { id: 11155111, rpc: "https://eth-sepolia.g.alchemy.com/v2/demo", type: "EVM" },
  BSC: { id: 56, rpc: "https://bsc-dataseed.binance.org", type: "EVM" },
  POLYGON: { id: 137, rpc: "https://polygon-rpc.com", type: "EVM" },
  ARBITRUM: { id: 42161, rpc: "https://arb1.arbitrum.io/rpc", type: "EVM" },
  OPTIMISM: { id: 10, rpc: "https://mainnet.optimism.io", type: "EVM" },
  AVALANCHE: { id: 43114, rpc: "https://api.avax.network/ext/bc/C/rpc", type: "EVM" },
  
  // Non-EVM Chains
  SOLANA: { id: "solana", rpc: "https://api.mainnet-beta.solana.com", type: "SOLANA" },
  APTOS: { id: "aptos", rpc: "https://fullnode.mainnet.aptoslabs.com", type: "APTOS" },
  SUI: { id: "sui", rpc: "https://fullnode.mainnet.sui.io", type: "SUI" },
  NEAR: { id: "near", rpc: "https://rpc.mainnet.near.org", type: "NEAR" },
  COSMOS: { id: "cosmos", rpc: "https://rpc.cosmos.network", type: "COSMOS" },
  TRON: { id: "tron", rpc: "https://api.trongrid.io", type: "TRON" },
  STELLAR: { id: "stellar", rpc: "https://horizon.stellar.org", type: "STELLAR" },
};

class FusionPlusService {
  private apiUrl: string;
  private evmProviders: Map<number, ethers.Provider>;
  private nonEvmClients: Map<string, any>;
  private swapContracts: Map<string, string>;

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_FUSION_API_URL || "http://localhost:3001";
    this.evmProviders = new Map();
    this.nonEvmClients = new Map();
    this.swapContracts = new Map();
    this.initializeProviders();
    this.initializeContracts();
  }

  private initializeProviders() {
    // Initialize EVM providers
    Object.entries(CHAIN_CONFIGS).forEach(([name, config]) => {
      if (config.type === "EVM" && typeof config.id === "number") {
        this.evmProviders.set(config.id, new ethers.JsonRpcProvider(config.rpc));
      }
    });

    // Initialize non-EVM clients
    this.initializeNonEvmClients();
  }

  private async initializeNonEvmClients() {
    try {
      // Solana
      this.nonEvmClients.set("solana", new Connection(CHAIN_CONFIGS.SOLANA.rpc));

      // Aptos
      this.nonEvmClients.set("aptos", new AptosClient(CHAIN_CONFIGS.APTOS.rpc));

      // Sui
      this.nonEvmClients.set("sui", new JsonRpcProvider(CHAIN_CONFIGS.SUI.rpc));

      // NEAR
      const nearConfig = {
        networkId: "mainnet",
        keyStore: new keyStores.InMemoryKeyStore(),
        nodeUrl: CHAIN_CONFIGS.NEAR.rpc,
      };
      const near = await nearConnect(nearConfig);
      this.nonEvmClients.set("near", near);

      // Tron
      const tronWeb = new TronWeb({
        fullHost: CHAIN_CONFIGS.TRON.rpc,
      });
      this.nonEvmClients.set("tron", tronWeb);

      // Stellar
      const stellarServer = new StellarSdk.Server(CHAIN_CONFIGS.STELLAR.rpc);
      this.nonEvmClients.set("stellar", stellarServer);
    } catch (error) {
      console.error("Error initializing non-EVM clients:", error);
    }
  }

  private initializeContracts() {
    // Contract addresses for each chain
    this.swapContracts.set("ETHEREUM", process.env.NEXT_PUBLIC_ETH_HTLC_ADDRESS || "");
    this.swapContracts.set("BSC", process.env.NEXT_PUBLIC_BSC_HTLC_ADDRESS || "");
    this.swapContracts.set("POLYGON", process.env.NEXT_PUBLIC_POLYGON_HTLC_ADDRESS || "");
    this.swapContracts.set("ARBITRUM", process.env.NEXT_PUBLIC_ARBITRUM_HTLC_ADDRESS || "");
    this.swapContracts.set("OPTIMISM", process.env.NEXT_PUBLIC_OPTIMISM_HTLC_ADDRESS || "");
    this.swapContracts.set("AVALANCHE", process.env.NEXT_PUBLIC_AVALANCHE_HTLC_ADDRESS || "");
    
    // Non-EVM contract addresses
    this.swapContracts.set("SOLANA", process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID || "");
    this.swapContracts.set("APTOS", process.env.NEXT_PUBLIC_APTOS_MODULE_ADDRESS || "0x1::fusion_htlc");
    this.swapContracts.set("SUI", process.env.NEXT_PUBLIC_SUI_PACKAGE_ID || "");
    this.swapContracts.set("NEAR", process.env.NEXT_PUBLIC_NEAR_CONTRACT_ID || "fusion-plus.near");
    this.swapContracts.set("COSMOS", process.env.NEXT_PUBLIC_COSMOS_CONTRACT_ADDRESS || "");
    this.swapContracts.set("TRON", process.env.NEXT_PUBLIC_TRON_CONTRACT_ADDRESS || "");
    this.swapContracts.set("STELLAR", process.env.NEXT_PUBLIC_STELLAR_CONTRACT_ID || "");
  }

  async getSwapQuote(params: SwapParams): Promise<SwapQuote> {
    try {
      // Call the 1inch Fusion API for quote
      const response = await axios.post(`${this.apiUrl}/api/v1/quote`, {
        fromChain: params.fromChain,
        toChain: params.toChain,
        fromToken: params.fromToken,
        toToken: params.toToken,
        amount: params.amount,
        slippage: params.slippage || 100, // 1% default
      });

      const { data } = response;

      // Calculate estimated time based on chain types
      const estimatedTime = this.calculateEstimatedTime(params.fromChain, params.toChain);

      // Get gas estimates for both chains
      const fromGas = await this.estimateGasForChain(params.fromChain, "create");
      const toGas = await this.estimateGasForChain(params.toChain, "claim");

      return {
        fromAmount: params.amount,
        toAmount: data.toAmount || params.amount,
        rate: data.rate || "1",
        estimatedGas: (parseFloat(fromGas) + parseFloat(toGas)).toString(),
        estimatedTime,
        route: this.buildRoute(params.fromChain, params.toChain),
      };
    } catch (error) {
      console.error("Error getting swap quote:", error);
      
      // Fallback calculation
      return {
        fromAmount: params.amount,
        toAmount: params.amount,
        rate: "1",
        estimatedGas: "0.005",
        estimatedTime: 300,
        route: [params.fromChain, "Fusion Bridge", params.toChain],
      };
    }
  }

  async executeSwap(params: SwapParams, signer?: ethers.Signer): Promise<string> {
    try {
      const fromChainConfig = this.getChainConfig(params.fromChain);
      const toChainConfig = this.getChainConfig(params.toChain);

      // Generate secret and hashlock
      const secret = ethers.hexlify(ethers.randomBytes(32));
      const hashlock = ethers.sha256(secret);
      const swapId = ethers.hexlify(ethers.randomBytes(16));

      // Set timelock (2 hours for cross-chain)
      const timelock = Math.floor(Date.now() / 1000) + 7200;

      let fromChainTx: string;

      // Execute based on source chain type
      if (fromChainConfig.type === "EVM") {
        fromChainTx = await this.executeEvmHTLC(params, signer!, hashlock, timelock);
      } else {
        // Handle non-EVM chains
        switch (params.fromChain) {
          case "SOLANA":
            fromChainTx = await this.executeSolanaHTLC(params, hashlock, timelock);
            break;
          case "APTOS":
            fromChainTx = await this.executeAptosHTLC(params, hashlock, timelock);
            break;
          case "SUI":
            fromChainTx = await this.executeSuiHTLC(params, hashlock, timelock);
            break;
          case "NEAR":
            fromChainTx = await this.executeNearHTLC(params, hashlock, timelock);
            break;
          case "COSMOS":
            fromChainTx = await this.executeCosmosHTLC(params, hashlock, timelock);
            break;
          case "TRON":
            fromChainTx = await this.executeTronHTLC(params, hashlock, timelock);
            break;
          case "STELLAR":
            fromChainTx = await this.executeStellarHTLC(params, hashlock, timelock);
            break;
          default:
            throw new Error(`Unsupported chain: ${params.fromChain}`);
        }
      }

      // Store swap details
      const swapStatus: SwapStatus = {
        swapId,
        status: "pending",
        fromChainTx,
        timestamp: Date.now(),
        secret,
        hashlock,
        expiryTime: timelock * 1000,
      };

      // Save to backend
      await this.saveSwapStatus(swapStatus);

      // Notify resolver service
      await this.notifyResolver({
        swapId,
        fromChain: params.fromChain,
        toChain: params.toChain,
        fromToken: params.fromToken,
        toToken: params.toToken,
        amount: params.amount,
        recipient: params.recipient || params.senderAddress!,
        hashlock,
        timelock,
      });

      return swapId;
    } catch (error) {
      console.error("Error executing swap:", error);
      throw error;
    }
  }

  async getSwapStatus(swapId: string): Promise<SwapStatus> {
    try {
      const response = await axios.get(`${this.apiUrl}/api/v1/swap/${swapId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting swap status:", error);
      throw error;
    }
  }

  // EVM HTLC execution
  private async executeEvmHTLC(
    params: SwapParams,
    signer: ethers.Signer,
    hashlock: string,
    timelock: number
  ): Promise<string> {
    const chainConfig = this.getChainConfig(params.fromChain);
    const htlcAddress = this.swapContracts.get(params.fromChain);
    
    if (!htlcAddress) throw new Error("HTLC contract not found");

    const htlcAbi = [
      "function createHTLC(address receiver, bytes32 hashlock, uint256 timelock) payable returns (bytes32)",
      "function createTokenHTLC(address token, address receiver, uint256 amount, bytes32 hashlock, uint256 timelock) returns (bytes32)"
    ];

    const htlcContract = new ethers.Contract(htlcAddress, htlcAbi, signer);

    if (params.fromToken === ethers.ZeroAddress) {
      // Native token (ETH, BNB, MATIC, etc.)
      const tx = await htlcContract.createHTLC(
        params.recipient || await signer.getAddress(),
        hashlock,
        timelock,
        { value: ethers.parseEther(params.amount) }
      );
      const receipt = await tx.wait();
      return receipt.hash;
    } else {
      // ERC20 token
      // First approve token transfer
      const tokenAbi = ["function approve(address spender, uint256 amount) returns (bool)"];
      const tokenContract = new ethers.Contract(params.fromToken, tokenAbi, signer);
      const approveTx = await tokenContract.approve(htlcAddress, ethers.parseEther(params.amount));
      await approveTx.wait();

      // Create token HTLC
      const tx = await htlcContract.createTokenHTLC(
        params.fromToken,
        params.recipient || await signer.getAddress(),
        ethers.parseEther(params.amount),
        hashlock,
        timelock
      );
      const receipt = await tx.wait();
      return receipt.hash;
    }
  }

  // Aptos HTLC execution
  private async executeAptosHTLC(
    params: SwapParams,
    hashlock: string,
    timelock: number
  ): Promise<string> {
    const client = this.nonEvmClients.get("aptos");
    const moduleAddress = this.swapContracts.get("APTOS");
    
    if (!params.privateKey) throw new Error("Private key required for Aptos");
    
    const account = new AptosAccount(new HexString(params.privateKey).toUint8Array());
    
    const payload = {
      type: "entry_function_payload",
      function: `${moduleAddress}::create_htlc`,
      type_arguments: ["0x1::aptos_coin::AptosCoin"],
      arguments: [
        params.recipient,
        hashlock,
        timelock,
        params.amount
      ]
    };

    const txnRequest = await client.generateTransaction(account.address(), payload);
    const signedTxn = await client.signTransaction(account, txnRequest);
    const txnResult = await client.submitTransaction(signedTxn);
    await client.waitForTransaction(txnResult.hash);
    
    return txnResult.hash;
  }

  // Sui HTLC execution
  private async executeSuiHTLC(
    params: SwapParams,
    hashlock: string,
    timelock: number
  ): Promise<string> {
    const client = this.nonEvmClients.get("sui");
    const packageId = this.swapContracts.get("SUI");
    
    if (!params.privateKey) throw new Error("Private key required for Sui");
    
    // Import Sui transaction builder

    const tx = new TransactionBlock();
    tx.moveCall({
      target: `${packageId}::fusion_htlc::create_htlc`,
      arguments: [
        tx.pure(params.recipient),
        tx.pure(hashlock),
        tx.pure(timelock),
        tx.pure(params.amount)
      ],
    });

    // Sign and execute transaction
    const result = await client.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      signer: params.privateKey, // This would need proper key pair setup
    });
    
    return result.digest;
  }

  // NEAR HTLC execution
  private async executeNearHTLC(
    params: SwapParams,
    hashlock: string,
    timelock: number
  ): Promise<string> {
    const near = this.nonEvmClients.get("near");
    const contractId = this.swapContracts.get("NEAR");
    
    if (!params.privateKey || !params.senderAddress) {
      throw new Error("Private key and sender address required for NEAR");
    }
    
    // Set up NEAR account
    const keyPair = nearUtils.KeyPair.fromString(params.privateKey);
    await near.connection.signer.keyStore.setKey("mainnet", params.senderAddress, keyPair);
    const account = await near.account(params.senderAddress);
    
    const result = await account.functionCall({
      contractId,
      methodName: "create_htlc",
      args: {
        receiver: params.recipient,
        hashlock,
        timelock_seconds: timelock - Math.floor(Date.now() / 1000),
      },
      gas: "100000000000000",
      attachedDeposit: nearUtils.format.parseNearAmount(params.amount),
    });
    
    return result.transaction.hash;
  }

  // Helper methods
  private getChainConfig(chain: string) {
    const config = Object.entries(CHAIN_CONFIGS).find(([name]) => name === chain);
    if (!config) throw new Error(`Unknown chain: ${chain}`);
    return config[1];
  }

  private calculateEstimatedTime(fromChain: string, toChain: string): number {
    const fromConfig = this.getChainConfig(fromChain);
    const toConfig = this.getChainConfig(toChain);
    
    // Base time for HTLC creation and claiming
    let time = 60; // 1 minute base
    
    // Add time based on chain finality
    const finalityTimes: Record<string, number> = {
      ETHEREUM: 180, // 3 minutes
      BSC: 60,
      POLYGON: 30,
      ARBITRUM: 10,
      OPTIMISM: 10,
      AVALANCHE: 10,
      SOLANA: 5,
      APTOS: 10,
      SUI: 10,
      NEAR: 10,
      COSMOS: 30,
      TRON: 60,
      STELLAR: 30,
    };
    
    time += (finalityTimes[fromChain] || 60) + (finalityTimes[toChain] || 60);
    
    return time;
  }

  private buildRoute(fromChain: string, toChain: string): string[] {
    return [fromChain, "1inch Fusion+", toChain];
  }

  private async estimateGasForChain(chain: string, operation: "create" | "claim"): Promise<string> {
    const config = this.getChainConfig(chain);
    
    if (config.type === "EVM") {
      const provider = this.evmProviders.get(config.id as number);
      if (!provider) return "0.001";
      
      const feeData = await provider.getFeeData();
      const gasPrice = feeData.gasPrice || BigInt(0);
      const gasLimit = operation === "create" ? BigInt(200000) : BigInt(100000);
      
      return ethers.formatEther(gasPrice * gasLimit);
    }
    
    // Non-EVM gas estimates
    const gasEstimates: Record<string, string> = {
      SOLANA: "0.00025",
      APTOS: "0.0001",
      SUI: "0.0001",
      NEAR: "0.0005",
      COSMOS: "0.001",
      TRON: "0.001",
      STELLAR: "0.00001",
    };
    
    return gasEstimates[chain] || "0.001";
  }

  private async saveSwapStatus(status: SwapStatus): Promise<void> {
    await axios.post(`${this.apiUrl}/api/v1/swap`, status);
  }

  private async notifyResolver(swapDetails: any): Promise<void> {
    await axios.post(`${this.apiUrl}/api/v1/resolver/notify`, swapDetails);
  }

  // Cosmos HTLC execution
  private async executeCosmosHTLC(params: SwapParams, hashlock: string, timelock: number): Promise<string> {
    if (!params.privateKey) throw new Error("Private key required for Cosmos");
    
    const wallet = await DirectSecp256k1HdWallet.fromKey(
      Buffer.from(params.privateKey.replace('0x', ''), 'hex'),
      "cosmos"
    );
    
    const [account] = await wallet.getAccounts();
    const client = await SigningStargateClient.connectWithSigner(
      CHAIN_CONFIGS.COSMOS.rpc,
      wallet
    );
    
    const contractAddress = this.swapContracts.get("COSMOS");
    if (!contractAddress) throw new Error("Cosmos contract address not configured");
    
    const msg = {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: {
        sender: account.address,
        contract: contractAddress,
        msg: {
          create_htlc: {
            receiver: params.recipient,
            hashlock: hashlock.replace('0x', ''),
            timelock: timelock.toString(),
          }
        },
        funds: [{
          denom: "uatom",
          amount: (parseFloat(params.amount) * 1e6).toString(), // Convert to uatom
        }],
      },
    };
    
    const result = await client.signAndBroadcast(
      account.address,
      [msg],
      "auto",
      "1inch Fusion+ HTLC"
    );
    
    return result.transactionHash;
  }

  // Tron HTLC execution
  private async executeTronHTLC(params: SwapParams, hashlock: string, timelock: number): Promise<string> {
    const tronWeb = this.nonEvmClients.get("tron");
    const contractAddress = this.swapContracts.get("TRON");
    
    if (!contractAddress) throw new Error("Tron contract address not configured");
    if (!params.privateKey) throw new Error("Private key required for Tron");
    
    // Set private key for signing
    tronWeb.setPrivateKey(params.privateKey);
    
    const contract = await tronWeb.contract().at(contractAddress);
    
    // Call createHTLC function
    const result = await contract.createHTLC(
      params.recipient,
      hashlock,
      timelock
    ).send({
      feeLimit: 100000000, // 100 TRX
      callValue: tronWeb.toSun(params.amount), // Convert TRX to Sun
      shouldPollResponse: true,
    });
    
    return result;
  }

  // Stellar HTLC execution
  private async executeStellarHTLC(params: SwapParams, hashlock: string, timelock: number): Promise<string> {
    const server = this.nonEvmClients.get("stellar");
    
    if (!params.privateKey) throw new Error("Private key required for Stellar");
    
    const sourceKeypair = StellarSdk.Keypair.fromSecret(params.privateKey);
    const contractId = this.swapContracts.get("STELLAR");
    
    if (!contractId) throw new Error("Stellar contract ID not configured");
    
    // Load source account
    const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());
    
    // Build transaction
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.PUBLIC,
    })
      .addOperation(
        StellarSdk.Operation.invokeContractFunction({
          contractId: contractId,
          function: "create_htlc",
          args: [
            StellarSdk.Address.fromString(params.recipient).toScVal(),
            StellarSdk.xdr.ScVal.scvBytes(Buffer.from(hashlock.replace('0x', ''), 'hex')),
            StellarSdk.xdr.ScVal.scvU64(StellarSdk.xdr.Uint64.fromString(timelock.toString())),
          ],
          source: sourceKeypair.publicKey(),
        })
      )
      .addOperation(
        StellarSdk.Operation.payment({
          destination: contractId,
          asset: StellarSdk.Asset.native(),
          amount: params.amount,
        })
      )
      .setTimeout(180)
      .build();
    
    // Sign and submit
    transaction.sign(sourceKeypair);
    const result = await server.submitTransaction(transaction);
    
    return result.hash;
  }

  // Solana HTLC execution (placeholder for now as it's more complex)
  private async executeSolanaHTLC(params: SwapParams, hashlock: string, timelock: number): Promise<string> {
    // Solana implementation requires more complex setup with PDAs and program interaction
    // This would integrate with the Solana Anchor program we built
    throw new Error("Solana HTLC implementation requires additional setup");
  }

  async getTokenBalance(
    chain: string,
    tokenAddress: string,
    userAddress: string
  ): Promise<string> {
    try {
      const chainConfig = this.getChainConfig(chain);

      if (chainConfig.type === "EVM") {
        const provider = this.evmProviders.get(chainConfig.id as number);
        if (!provider) throw new Error("Provider not found");

        // For native tokens
        if (tokenAddress === ethers.ZeroAddress) {
          const balance = await provider.getBalance(userAddress);
          return ethers.formatEther(balance);
        }

        // For ERC20 tokens
        const tokenContract = new ethers.Contract(
          tokenAddress,
          ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"],
          provider
        );

        const [balance, decimals] = await Promise.all([
          tokenContract.balanceOf(userAddress),
          tokenContract.decimals()
        ]);
        
        return ethers.formatUnits(balance, decimals);
      }

      // Non-EVM chain balance queries
      switch (chain) {
        case "NEAR": {
          const near = this.nonEvmClients.get("near");
          const account = await near.account(userAddress);
          const balance = await account.getAccountBalance();
          return nearUtils.format.formatNearAmount(balance.available);
        }

        case "APTOS": {
          const client = this.nonEvmClients.get("aptos");
          const resources = await client.getAccountResources(userAddress);
          const coinResource = resources.find(
            (r: any) => r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
          );
          if (coinResource) {
            return (Number(coinResource.data.coin.value) / 1e8).toString();
          }
          return "0";
        }

        case "SUI": {
          const client = this.nonEvmClients.get("sui");
          const coins = await client.getCoins({
            owner: userAddress,
            coinType: "0x2::sui::SUI"
          });
          const total = coins.data.reduce((sum, coin) => sum + BigInt(coin.balance), BigInt(0));
          return (Number(total) / 1e9).toString();
        }

        case "SOLANA": {
          const connection = this.nonEvmClients.get("solana");
          const publicKey = new PublicKey(userAddress);
          const balance = await connection.getBalance(publicKey);
          return (balance / 1e9).toString(); // Convert lamports to SOL
        }

        case "COSMOS": {
          // Would need to query Cosmos bank module
          return "0";
        }

        case "TRON": {
          const tronWeb = this.nonEvmClients.get("tron");
          const balance = await tronWeb.trx.getBalance(userAddress);
          return tronWeb.fromSun(balance);
        }

        case "STELLAR": {
          const server = this.nonEvmClients.get("stellar");
          const account = await server.loadAccount(userAddress);
          const xlmBalance = account.balances.find((b: any) => b.asset_type === "native");
          return xlmBalance ? xlmBalance.balance : "0";
        }

        default:
          return "0";
      }
    } catch (error) {
      console.error("Error getting token balance:", error);
      return "0";
    }
  }

  async estimateGasFees(chain: string): Promise<string> {
    try {
      return await this.estimateGasForChain(chain, "create");
    } catch (error) {
      console.error("Error estimating gas fees:", error);
      return "0.001"; // Default fallback
    }
  }

  // Add method to get supported chains
  getSupportedChains() {
    return Object.entries(CHAIN_CONFIGS).map(([name, config]) => ({
      name,
      id: config.id,
      type: config.type,
      rpc: config.rpc,
      isTestnet: name.includes("SEPOLIA") || name.includes("TESTNET"),
    }));
  }

  // Add method to validate addresses
  isValidAddress(chain: string, address: string): boolean {
    const chainConfig = this.getChainConfig(chain);

    if (chainConfig.type === "EVM") {
      return ethers.isAddress(address);
    }

    // Non-EVM address validation
    switch (chain) {
      case "NEAR":
        return /^[a-z0-9._-]+$/.test(address) && address.length >= 2 && address.length <= 64;
      
      case "APTOS":
        return /^0x[a-fA-F0-9]{64}$/.test(address);
      
      case "SUI":
        return /^0x[a-fA-F0-9]{64}$/.test(address);
      
      case "SOLANA":
        try {
          new PublicKey(address);
          return true;
        } catch {
          return false;
        }
      
      case "COSMOS":
        return address.startsWith("cosmos1") && address.length === 45;
      
      case "TRON":
        return address.startsWith("T") && address.length === 34;
      
      case "STELLAR":
        return address.startsWith("G") && address.length === 56;
      
      default:
        return false;
    }
  }
}

export const fusionPlusService = new FusionPlusService();