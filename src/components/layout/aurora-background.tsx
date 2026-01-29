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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.1),transparent_40%),radial-gradient(circle_at_1px_1px,hsl(var(--border))_1px,transparent_0)] bg-[length:100%_100%,2rem_2rem]"></div>
    </div>
  )
}
