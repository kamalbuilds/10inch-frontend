"use client"

import { cn } from "@/lib/utils"

interface MeteorsProps {
    number?: number
    className?: string
}

export function Meteors({ number = 20, className }: MeteorsProps) {
    const meteors = new Array(number).fill(true)

    return (
        <>
            {meteors.map((_, idx) => (
                <span
                    key={idx}
                    className={cn(
                        "absolute left-1/2 top-1/2 h-0.5 w-0.5 rotate-[215deg] animate-meteor-effect rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
                        "before:absolute before:top-1/2 before:h-[1px] before:w-[50px] before:-translate-y-[50%] before:transform before:bg-gradient-to-r before:from-[#64748b] before:to-transparent before:content-['']",
                        className,
                    )}
                    style={{
                        top: Math.floor(Math.random() * (400 - -400) + -400) + "px",
                        left: Math.floor(Math.random() * (400 - -400) + -400) + "px",
                        animationDelay: Math.random() * (0.8 - 0.2) + 0.2 + "s",
                        animationDuration: Math.floor(Math.random() * (10 - 2) + 2) + "s",
                    }}
                />
            ))}
        </>
    )
}
