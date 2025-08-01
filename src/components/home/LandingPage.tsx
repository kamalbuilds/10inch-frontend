"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    ArrowRight,
    Zap,
    Shield,
    Globe,
    TrendingUp,
    Wallet,
    RefreshCw,
    ChevronDown,
    Star,
    Users,
    DollarSign,
    Clock,
    Sparkles,
    Layers,
    Network,
} from "lucide-react"
import { Particles } from "./particles"
import { TypingAnimation } from "./typing-animation"
import HeroSection from "./HeroSection"

const supportedChains = {
    evm: [
        { name: "Ethereum", symbol: "ETH", color: "bg-blue-500" },
        { name: "BSC", symbol: "BNB", color: "bg-yellow-500" },
        { name: "Polygon", symbol: "MATIC", color: "bg-purple-500" },
        { name: "Arbitrum", symbol: "ARB", color: "bg-blue-400" },
        { name: "Optimism", symbol: "OP", color: "bg-red-500" },
        { name: "Avalanche", symbol: "AVAX", color: "bg-red-400" },
    ],
    nonEvm: [
        { name: "Aptos", symbol: "APT", color: "bg-green-500" },
        { name: "Sui", symbol: "SUI", color: "bg-cyan-500" },
        { name: "Cosmos", symbol: "ATOM", color: "bg-indigo-500" },
        { name: "Stellar", symbol: "XLM", color: "bg-blue-600" },
        { name: "Tron", symbol: "TRX", color: "bg-red-600" },
        { name: "TON", symbol: "TON", color: "bg-blue-700" },
    ],
}

const features = [
    {
        icon: Globe,
        title: "Cross-Chain Swaps",
        description: "Seamlessly swap tokens across EVM and non-EVM chains with a single interface",
    },
    {
        icon: Zap,
        title: "Fusion+ Technology",
        description: "Powered by 1inch Fusion+ for optimal routing and MEV protection",
    },
    {
        icon: Shield,
        title: "Secure & Trustless",
        description: "Non-custodial swaps with advanced security protocols",
    },
    {
        icon: TrendingUp,
        title: "Best Rates",
        description: "Aggregated liquidity for the most competitive swap rates",
    },
    {
        icon: Wallet,
        title: "Multi-Wallet Support",
        description: "Connect with MetaMask, WalletConnect, and chain-specific wallets",
    },
    {
        icon: RefreshCw,
        title: "Real-time Quotes",
        description: "Live price updates and instant swap estimates",
    },
]

const stats = [
    { label: "Supported Chains", value: "12+", icon: Globe },
    { label: "Total Volume", value: "$2.5B+", icon: DollarSign },
    { label: "Active Users", value: "100K+", icon: Users },
    { label: "Avg Swap Time", value: "< 30s", icon: Clock },
]

export default function LandingPage() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden relative">
            {/* Animated Background Elements */}
            <Particles className="fixed inset-0 z-0" quantity={80} />

            {/* Grid Background */}
            <div className="fixed inset-0 z-0 grid-pattern opacity-30" />

            {/* Dynamic Background Gradients */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div
                    className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
                    style={{ animationDelay: "1s" }}
                />
                <div
                    className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
                    style={{ animationDelay: "2s" }}
                />
            </div>

            <HeroSection />

            {/* Stats Section */}
            <section className="relative z-10 px-6 py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div
                                key={stat.label}
                                className="relative text-center group hover:scale-105 transition-transform duration-300"
                            >
                                <div className="relative">
                                    <div className="flex justify-center mb-6">
                                        <div className="relative w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-blue-500/30 group-hover:border-blue-400/50 transition-all duration-300 animate-pulse-glow">
                                            <stat.icon className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
                                        </div>
                                    </div>
                                    <div className="text-4xl font-bold text-white mb-3 animate-pulse">{stat.value}</div>
                                    <div className="text-gray-400 font-medium">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Supported Chains Section */}
            <section className="relative z-10 px-6 py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-bold mb-8">
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                                12+ Chains
                            </span>
                            <br />
                            <span className="text-white">One Interface</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Swap tokens across the most popular EVM and non-EVM blockchains with a single, unified interface
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* EVM Chains */}
                        <div className="relative hover:scale-105 transition-transform duration-500">
                            <Card className="relative bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-500/30 backdrop-blur-sm overflow-hidden group">
                                <CardContent className="p-8 relative z-10">
                                    <div className="flex items-center mb-8">
                                        <div className="relative w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mr-4 border border-blue-400/30">
                                            <Globe className="w-7 h-7 text-blue-400" />
                                            <div className="absolute inset-0 bg-blue-400/20 rounded-xl animate-pulse" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-1">EVM Chains</h3>
                                            <p className="text-blue-300">Ethereum Virtual Machine Compatible</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {supportedChains.evm.map((chain, index) => (
                                            <div
                                                key={chain.name}
                                                className="relative flex items-center space-x-3 p-4 rounded-xl bg-black/20 border border-gray-700/50 backdrop-blur-sm group/item overflow-hidden hover:scale-105 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-300"
                                            >
                                                <div
                                                    className={`relative w-10 h-10 ${chain.color} rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg`}
                                                >
                                                    {chain.symbol.slice(0, 2)}
                                                    <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-spin-slow" />
                                                </div>
                                                <span className="text-white font-medium relative z-10">{chain.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Non-EVM Chains */}
                        <div className="relative hover:scale-105 transition-transform duration-500">
                            <Card className="relative bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-500/30 backdrop-blur-sm overflow-hidden group">
                                <CardContent className="p-8 relative z-10">
                                    <div className="flex items-center mb-8">
                                        <div className="relative w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mr-4 border border-purple-400/30">
                                            <Network className="w-7 h-7 text-purple-400" />
                                            <div
                                                className="absolute inset-0 bg-purple-400/20 rounded-xl animate-pulse"
                                                style={{ animationDelay: "0.5s" }}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-1">Non-EVM Chains</h3>
                                            <p className="text-purple-300">Alternative Blockchain Architectures</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {supportedChains.nonEvm.map((chain, index) => (
                                            <div
                                                key={chain.name}
                                                className="relative flex items-center space-x-3 p-4 rounded-xl bg-black/20 border border-gray-700/50 backdrop-blur-sm group/item overflow-hidden hover:scale-105 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all duration-300"
                                            >
                                                <div
                                                    className={`relative w-10 h-10 ${chain.color} rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg`}
                                                >
                                                    {chain.symbol.slice(0, 2)}
                                                    <div
                                                        className="absolute inset-0 rounded-full border-2 border-white/30 animate-spin-slow"
                                                        style={{ animationDirection: "reverse" }}
                                                    />
                                                </div>
                                                <span className="text-white font-medium relative z-10">{chain.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative z-10 px-6 py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-bold mb-8">
                            Why Choose
                            <br />
                            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Fusion+ Cross-Chain?
                            </span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Experience the next generation of decentralized trading with advanced features and unmatched security
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={feature.title}
                                className="relative group hover:scale-105 hover:-translate-y-2 transition-all duration-500"
                            >
                                <Card className="relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700/50 h-full backdrop-blur-sm overflow-hidden">
                                    <CardContent className="p-8 relative z-10">
                                        <div className="relative w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-6 border border-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                                            <feature.icon className="w-8 h-8 text-blue-400" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl animate-pulse" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                                            {feature.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="relative z-10 px-6 py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-bold mb-8">
                            How It{" "}
                            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Works</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Simple, secure, and fast cross-chain swaps in just a few clicks
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                step: "01",
                                title: "Connect Wallet",
                                description: "Connect your preferred wallet and select source and destination chains",
                                icon: Wallet,
                            },
                            {
                                step: "02",
                                title: "Enter Swap Details",
                                description: "Choose tokens and amounts, get real-time quotes with optimal routing",
                                icon: RefreshCw,
                            },
                            {
                                step: "03",
                                title: "Execute Swap",
                                description: "Confirm transaction and watch your tokens arrive on the destination chain",
                                icon: Zap,
                            },
                        ].map((step, index) => (
                            <div
                                key={step.step}
                                className="relative text-center group hover:scale-105 transition-transform duration-500"
                            >
                                <div className="relative mb-8">
                                    <div className="relative w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-300 animate-pulse-glow">
                                        <span className="text-2xl font-bold text-white relative z-10">{step.step}</span>
                                        <div className="absolute inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full animate-spin-slow" />
                                    </div>

                                    {index < 2 && (
                                        <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-blue-500/50 to-purple-500/50 animate-pulse" />
                                    )}
                                </div>

                                <div className="relative p-6 rounded-xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 backdrop-blur-sm group-hover:border-blue-500/30 transition-all duration-300">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                                        <step.icon className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 px-6 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="relative bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-3xl p-12 border border-blue-500/30 backdrop-blur-sm overflow-hidden group hover:scale-105 transition-transform duration-500">
                        <h2 className="text-4xl md:text-6xl font-bold mb-8 animate-pulse-glow">
                            Ready to Swap
                            <br />
                            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Across Any Chain?
                            </span>
                        </h2>

                        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Join thousands of users already swapping tokens across 12+ blockchains with the best rates and security
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-10 py-6 animate-shimmer hover:scale-105 transition-transform duration-300"
                            >
                                <span className="flex items-center">
                                    Launch App Now
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </span>
                            </Button>

                            <Button
                                size="lg"
                                variant="outline"
                                className="border-gray-600 text-white hover:bg-gray-800 text-lg px-10 py-6 bg-transparent backdrop-blur-sm hover:scale-105 transition-all duration-300"
                            >
                                <span className="flex items-center">
                                    Read Documentation
                                    <Layers className="ml-2 w-5 h-5" />
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 px-6 py-12 border-t border-gray-800 backdrop-blur-sm bg-black/20">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0 hover:scale-105 transition-transform duration-300">
                            <div className="relative w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                <Zap className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                Fusion+ Cross-Chain
                            </span>
                        </div>

                        <div className="flex space-x-8 text-gray-400">
                            {["Documentation", "Support", "Terms", "Privacy"].map((link, index) => (
                                <a
                                    key={link}
                                    href="#"
                                    className="hover:text-white transition-colors relative group hover:scale-110 duration-300"
                                >
                                    {link}
                                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
                        <p>&copy; 2024 Fusion+ Cross-Chain. Built on 1inch Fusion+ Technology.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
