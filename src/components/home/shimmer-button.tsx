"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface ShimmerButtonProps {
    children: ReactNode
    className?: string
    onClick?: () => void
}

export function ShimmerButton({ children, className, onClick }: ShimmerButtonProps) {
    return (
        <button
            className={cn(
                "relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25",
                "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000",
                className,
            )}
            onClick={onClick}
        >
            <span className="relative z-10">{children}</span>
        </button>
    )
}
