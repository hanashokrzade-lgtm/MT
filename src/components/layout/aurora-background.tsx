'use client'

import { cn } from "@/lib/utils"

export function AuroraBackground() {
  return (
    <div 
        className={cn(
            "absolute top-0 left-0 w-full h-full -z-10 overflow-hidden transition-all duration-500",
            "bg-background"
        )}
    >
        <div 
            className="relative w-full h-full opacity-50 dark:opacity-40"
        >
            <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] rounded-full bg-primary/30 filter blur-3xl animate-blob-1" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/40 filter blur-3xl animate-blob-2" />
            <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] rounded-full bg-primary/20 filter blur-2xl animate-blob-3" />
        </div>
    </div>
  )
}
