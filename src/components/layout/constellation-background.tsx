'use client'

import { useRef, useEffect } from 'react'

class Blob {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string

  constructor(x: number, y: number, vx: number, vy: number, radius: number, color: string) {
    this.x = x
    this.y = y
    this.vx = vx
    this.vy = vy
    this.radius = radius
    this.color = color
  }

  update(width: number, height: number) {
    this.x += this.vx
    this.y += this.vy

    if (this.x - this.radius < 0 || this.x + this.radius > width) {
      this.vx *= -1
    }
    if (this.y - this.radius < 0 || this.y + this.radius > height) {
      this.vy *= -1
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.fillStyle = this.color
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fill()
  }
}

export function ConstellationBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameIdRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()
    const [h, s, l] = primaryColor.split(' ').map(parseFloat);

    const colors = [
        `hsl(${h}, ${s}%, ${l}%)`,
        `hsl(${h}, ${s - 10}%, ${l + 10}%)`,
        `hsl(${h + 20}, ${s - 5}%, ${l + 5}%)`,
        `hsl(${h - 20}, ${s}%, ${l}%)`,
    ];
    
    const blobs: Blob[] = []
    const blobCount = 4

    const init = () => {
      blobs.length = 0
      for (let i = 0; i < blobCount; i++) {
        const radius = Math.random() * (Math.min(width, height) / 4) + (Math.min(width, height) / 6);
        const x = Math.random() * (width - radius * 2) + radius;
        const y = Math.random() * (height - radius * 2) + radius;
        const vx = (Math.random() - 0.5) * 1.5;
        const vy = (Math.random() - 0.5) * 1.5;
        const color = colors[i % colors.length];
        blobs.push(new Blob(x, y, vx, vy, radius, color));
      }
    }

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height)

      blobs.forEach(blob => {
        blob.update(width, height)
        blob.draw(ctx)
      })

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
      className="absolute top-0 left-0 w-full h-full -z-10 bg-background"
      style={{
          filter: 'blur(100px) contrast(25)',
      }}
    />
  )
}
