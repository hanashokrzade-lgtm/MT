import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Check if window is defined (so it doesn't break on server-side rendering)
    if (typeof window === "undefined") {
        return;
    }
    
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Set the initial value
    checkIsMobile()
    
    window.addEventListener("resize", checkIsMobile)
    
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  return isMobile ?? false;
}

    