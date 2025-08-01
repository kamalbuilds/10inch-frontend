"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface BorderBeamProps {
    className?: string
    size?: number
    duration?: number
    borderWidth?: number
    colorFrom?: string
    colorTo?: string
    delay?: number
}

export function BorderBeam({
    className,
    size = 200,
    duration = 15,
    borderWidth = 1.5,
    colorFrom = "#3b82f6",
    colorTo = "#8b5cf6",
    delay = 0,
}: BorderBeamProps) {
    return (
        <div
            className={cn(
                "pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent]",
                className,
            )}
            style={
                {
                    "--border-width": borderWidth,
                    "--color-from": colorFrom,
                    "--color-to": colorTo,
                    "--size": size,
                    "--duration": `${duration}s`,
                    "--delay": `${delay}s`,
                } as React.CSSProperties
            }
        >
            <div
                className="absolute aspect-square w-full rounded-[inherit] animate-spin"
                style={{
                    background: `conic-gradient(from 0deg, transparent 0deg, ${colorFrom} 180deg, ${colorTo} 360deg)`,
                    animationDuration: `${duration}s`,
                    animationDelay: `${delay}s`,
                }}
            />
        </div>
    )
}
