'use client'

import { useRef, useEffect } from 'react'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
}

export function ConstellationBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameIdRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    const particleCount = Math.floor(width / 15) // Increased particle density
    const maxDistance = 180 // Increased connection distance
    const colors = [
      'hsla(173, 70%, 45%, 0.6)', // Primary Teal
      'hsla(200, 15%, 96%, 0.6)', // Background muted
      'hsla(180, 5%, 65%, 0.6)', // Muted foreground
    ];

    const init = () => {
      particlesRef.current = []
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 1.5 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      particlesRef.current.forEach(p => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()
      })

      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i]
          const p2 = particlesRef.current[j]
          const distance = Math.sqrt(
            Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
          )

          if (distance < maxDistance) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            const lineColor = p1.color.replace(/, 0.6\)$/, `, ${0.7 - distance / maxDistance})`)
            ctx.strokeStyle = lineColor
            ctx.lineWidth = 0.4
            ctx.stroke()
          }
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      init()
    }

    init()
    animate()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full -z-10 opacity-70"
    />
  )
}
