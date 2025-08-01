import React from 'react';
import { Button } from '../ui/button';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { BoxReveal } from '../magicui/box-reveal';
import { OrbitingCirclesDemo } from './OrbitingComponent';

const HeroSection = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-start z-10 px-6 py-20 text-left">
            <div className="flex-1">
                <div className="relative inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full px-6 py-2 border border-blue-500/30 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                    <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
                    <span className="text-sm font-medium">Powered by 1inch Fusion+ Technology</span>
                    <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                </div>

                <div className="size-full max-w-lg items-center justify-center overflow-hidden">
                    <BoxReveal boxColor={"#5046e6"} duration={0.5}>
                        <p className="text-[3.5rem] font-semibold">
                            Fusion+ Pro<span className="text-[#5046e6]">.</span>
                        </p>
                    </BoxReveal>

                    <BoxReveal boxColor={"#5046e6"} duration={0.5}>
                        <h2 className="mt-[.5rem] text-[1rem]">
                            Extending 1inch&apos;s {" "}
                            <span className="text-[#5046e6]">Fusion+ Swaps</span>
                        </h2>
                    </BoxReveal>

                    <BoxReveal boxColor={"#5046e6"} duration={0.5}>
                        <div className="mt-6">
                            <p className="text-lg text-gray-300 mb-10 max-w-3xl leading-relaxed">
                                The first cross-chain DEX aggregator supporting both EVM and non-EVM chains. Experience seamless token swaps
                                across{" "}
                                <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-semibold">
                                    12+ blockchains
                                </span>{" "}
                                with optimal rates and security.
                            </p>
                        </div>
                    </BoxReveal>

                    <BoxReveal boxColor={"#5046e6"} duration={0.5}>
                        <Button className="mt-[1.6rem] bg-[#5046e6]">
                            <span className="flex items-center">
                                Start Swapping
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </span>
                        </Button>
                        <Button
                            variant="outline"
                            className="border-gray-600 ml-6 text-white hover:bg-gray-800 bg-transparent backdrop-blur-sm hover:scale-105 transition-all duration-300"
                        >
                            View Documentation
                        </Button>
                    </BoxReveal>
                </div>
            </div>
            <OrbitingCirclesDemo />
        </section>
    );
};

export default HeroSection;