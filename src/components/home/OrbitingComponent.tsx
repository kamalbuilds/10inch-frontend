import { OrbitingCircles } from "@/components/magicui/orbiting-circles";
import { SUPPORTED_CHAINS, ChainConfig } from "@/config/tokens";

export function OrbitingCirclesDemo() {
    // Take first 8 chains for the outer orbit
    const outerChains = SUPPORTED_CHAINS.slice(0, 8);
    // Take next 6 chains for the inner orbit
    const innerChains = SUPPORTED_CHAINS.slice(8, 14);

    return (
        <div className="relative flex flex-1 h-[500px] w-full flex-col items-center justify-center overflow-hidden">
            <OrbitingCircles iconSize={60} speed={4}>
                {outerChains.map((chain, index) => (
                    <ChainIcon key={chain.id} chain={chain} />
                ))}
            </OrbitingCircles>
            <OrbitingCircles iconSize={50} radius={100} reverse speed={2}>
                {innerChains.map((chain, index) => (
                    <ChainIcon key={chain.id} chain={chain} />
                ))}
            </OrbitingCircles>
        </div>
    );
}

interface ChainIconProps {
    chain: ChainConfig;
}

function ChainIcon({ chain }: ChainIconProps) {
    return (
        <div className="relative">
            {chain.logoURI ? (
                <img
                    src={chain.logoURI}
                    alt={chain.name}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                        // Fallback to a default icon if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                    }}
                />
            ) : null}
            <div className={`${chain.logoURI ? 'hidden' : ''} w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold`}>
                {chain.nativeCurrency.symbol.slice(0, 2)}
            </div>
        </div>
    );
}
