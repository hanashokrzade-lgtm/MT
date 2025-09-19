'use client'

import { useRef, useEffect } from 'react'

type Dot = {
  x: number
  y: number
  size: number
  targetSize: number
  waveOffset: number
}

export function ConstellationBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameIdRef = useRef<number>()
  const mousePosRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    const dots: Dot[] = []
    
    const spacing = 40
    const baseSize = 1
    const hoverRadius = 200
    const baseColor = 'hsla(173, 80%, 35%, 0.4)'
    const hoverColor = 'hsla(173, 70%, 55%, 1)'


    const init = () => {
      dots.length = 0; // Clear the array
      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          dots.push({
            x: x,
            y: y,
            size: baseSize,
            targetSize: baseSize,
            waveOffset: Math.random() * Math.PI * 2,
          })
        }
      }
    }

    const animate = (time: number) => {
      ctx.clearRect(0, 0, width, height)
      const { x: mouseX, y: mouseY } = mousePosRef.current;

      dots.forEach(dot => {
        const distToMouse = Math.sqrt((dot.x - mouseX) ** 2 + (dot.y - mouseY) ** 2)
        
        let desiredSize = baseSize
        let color = baseColor

        if (distToMouse < hoverRadius) {
            const proximity = 1 - (distToMouse / hoverRadius)
            desiredSize = baseSize + proximity * 4
            color = `hsla(173, 70%, ${55 + proximity * 20}%, ${0.5 + proximity * 0.5})`
        } else {
             // Add wave effect only when not hovered
            desiredSize = baseSize + Math.sin(time * 0.001 + dot.waveOffset) * 0.5;
        }

        // Smooth transition for size
        dot.size += (desiredSize - dot.size) * 0.1;

        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
      })

      animationFrameIdRef.current = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      init()
    }
    
    const handleMouseMove = (e: MouseEvent) => {
        mousePosRef.current = { x: e.clientX, y: e.clientY };
    }
    
    const handleMouseLeave = () => {
        mousePosRef.current = { x: -9999, y: -9999 };
    }

    init()
    animate(0)

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full -z-10 opacity-100 bg-background"
    />
  )
}
