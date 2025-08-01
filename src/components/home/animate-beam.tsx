"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface AnimatedBeamProps {
    className?: string
    duration?: number
    delay?: number
}

export function AnimatedBeam({ className, duration = 3, delay = 0 }: AnimatedBeamProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay * 1000)
        return () => clearTimeout(timer)
    }, [delay])

    return (
        <div
            className={cn(
                "absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent transition-transform duration-1000 ease-linear",
                isVisible ? "translate-x-full" : "-translate-x-full",
                className,
            )}
            style={{
                animation: isVisible ? `slideBeam ${duration}s linear infinite` : undefined,
            }}
        />
    )
}
