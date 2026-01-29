'use client'

import { useRef, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

// A class for a single particle (star)
class Particle {
  x: number
  y: number
  size: number
  vx: number
  vy: number

  constructor(x: number, y: number, size: number, vx: number, vy: number) {
    this.x = x
    this.y = y
    this.size = size
    this.vx = vx
    this.vy = vy
  }

  // Update particle position and handle bouncing off edges
  update(width: number, height: number) {
    this.x += this.vx
    this.y += this.vy

    if (this.x < 0 || this.x > width) this.vx *= -1
    if (this.y < 0 || this.y > height) this.vy *= -1
  }

  // Draw the particle
  draw(ctx: CanvasRenderingContext2D, color: string) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  }
}

export function ConstellationBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameIdRef = useRef<number>()
  const [isMounted, setIsMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  // Track mouse position
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = event.clientX
      mouse.current.y = event.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    let particles: Particle[] = []
    const particleCount = Math.floor((width * height) / 15000); // Adjust density based on screen size
    const connectDistance = Math.min(width, height) / 5;
    const interactiveRadius = connectDistance * 0.75;


    const init = () => {
      particles = []
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 1.5 + 0.5
        const x = Math.random() * width
        const y = Math.random() * height
        const vx = (Math.random() - 0.5) * 0.3
        const vy = (Math.random() - 0.5) * 0.3
        particles.push(new Particle(x, y, size, vx, vy))
      }
    }

    const animate = () => {
        if (!ctx) return
        
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        const [h, s, l] = primaryColor.split(' ').map(parseFloat);
        const particleColor = `hsl(${h}, ${s}%, ${l}%)`;
        const lineColor = `hsla(${h}, ${s}%, ${l}%, 0.5)`;

        ctx.clearRect(0, 0, width, height)

        // Update and draw particles
        for (const p of particles) {
            p.update(width, height)
            p.draw(ctx, particleColor)
        }

        // Draw connecting lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x
                const dy = particles[i].y - particles[j].y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance < connectDistance) {
                    ctx.beginPath()
                    ctx.strokeStyle = lineColor
                    ctx.lineWidth = 0.2
                    ctx.moveTo(particles[i].x, particles[i].y)
                    ctx.lineTo(particles[j].x, particles[j].y)
                    ctx.globalAlpha = 1 - distance / connectDistance
                    ctx.stroke()
                    ctx.globalAlpha = 1
                }
            }
        }
        
        // Draw interactive lines from mouse
        if (mouse.current.x && mouse.current.y) {
            for (const p of particles) {
                const dx = p.x - mouse.current.x;
                const dy = p.y - mouse.current.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < interactiveRadius) {
                     ctx.beginPath()
                     ctx.strokeStyle = lineColor
                     ctx.lineWidth = 0.3
                     ctx.moveTo(mouse.current.x, mouse.current.y)
                     ctx.lineTo(p.x, p.y)
                     ctx.globalAlpha = 1 - distance / interactiveRadius
                     ctx.stroke()
                     ctx.globalAlpha = 1
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
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
      }
    }
  }, [isMounted, resolvedTheme])

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full -z-10 bg-background transition-opacity duration-500"
      style={{
          opacity: resolvedTheme === 'dark' ? 0.5 : 0.7,
      }}
    />
  )
}
