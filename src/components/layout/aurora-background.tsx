'use client'

import { cn } from "@/lib/utils"

export function AuroraBackground() {
  return (
    <div 
        className={cn(
            "absolute top-0 left-0 w-full h-full -z-10 overflow-hidden",
            "bg-background"
        )}
    >
        {/* Dot Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,hsl(var(--border)/0.5)_1px,transparent_0)] bg-[length:2rem_2rem]"></div>
        
        {/* Color Halos */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-20%] right-[0%] h-[400px] w-[400px] rounded-full bg-primary/10 blur-3xl lg:h-[600px] lg:w-[600px] lg:top-[-30%] lg:right-[-5%]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] h-[350px] w-[350px] rounded-full bg-fuchsia-500/10 blur-3xl lg:h-[500px] lg:w-[500px] lg:bottom-[-20%] lg:left-[-5%]"></div>
            <div className="absolute bottom-[0%] right-[20%] h-[300px] w-[500px] rounded-full bg-sky-500/10 blur-3xl lg:h-[400px] lg:w-[700px] lg:bottom-[-10%]"></div>
        </div>
    </div>
  )
}
