"use client"

import { cn } from "@/lib/utils"

interface AnimatedGridProps {
    className?: string
    size?: number
}

export function AnimatedGrid({ className, size = 20 }: AnimatedGridProps) {
    return (
        <div className={cn("absolute inset-0 overflow-hidden opacity-30", className)}>
            <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width={size} height={size} patternUnits="userSpaceOnUse">
                        <path
                            d={`M ${size} 0 L 0 0 0 ${size}`}
                            fill="none"
                            stroke="rgba(59, 130, 246, 0.2)"
                            strokeWidth="1"
                            className="animate-pulse"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>
    )
}
