"use client"

import { useEffect, useRef } from "react"

interface ThermometerProps {
  percentage: number
  severity: "low" | "medium" | "high"
}

export function Thermometer({ percentage, severity }: ThermometerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with higher resolution for retina displays
    const dpr = window.devicePixelRatio || 1
    canvas.width = 300 * dpr
    canvas.height = 500 * dpr

    // Scale all drawing operations
    ctx.scale(dpr, dpr)

    // Set display size
    canvas.style.width = "300px"
    canvas.style.height = "500px"

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw thermometer
    drawThermometer(ctx, percentage, severity)
  }, [percentage, severity])

  const drawThermometer = (ctx: CanvasRenderingContext2D, percentage: number, severity: "low" | "medium" | "high") => {
    // Thermometer dimensions
    const centerX = 150
    const bulbCenterY = 400
    const bulbRadius = 50
    const tubeWidth = 30
    const tubeHeight = 300
    const tubeTopY = bulbCenterY - tubeHeight

    // Colors based on severity
    let fillColor
    if (severity === "low") {
      fillColor = "#dc2626" // red-600
    } else if (severity === "medium") {
      fillColor = "#f97316" // orange-500
    } else {
      fillColor = "#16a34a" // green-600
    }

    // Draw tube outline
    ctx.beginPath()
    ctx.rect(centerX - tubeWidth / 2, tubeTopY, tubeWidth, tubeHeight)
    ctx.fillStyle = "#f1f5f9" // slate-100
    ctx.fill()
    ctx.lineWidth = 3
    ctx.strokeStyle = "#334155" // slate-700
    ctx.stroke()

    // Draw bulb outline
    ctx.beginPath()
    ctx.arc(centerX, bulbCenterY, bulbRadius, 0, Math.PI * 2)
    ctx.fillStyle = "#f1f5f9" // slate-100
    ctx.fill()
    ctx.lineWidth = 3
    ctx.strokeStyle = "#334155" // slate-700
    ctx.stroke()

    // Calculate fill height based on percentage
    const fillHeight = (percentage / 100) * tubeHeight
    const fillTopY = bulbCenterY - fillHeight

    // Fill the tube based on percentage
    if (percentage > 0) {
      ctx.beginPath()
      ctx.rect(centerX - tubeWidth / 2 + 3, fillTopY, tubeWidth - 6, fillHeight)
      ctx.fillStyle = fillColor
      ctx.fill()

      // Fill the bulb
      ctx.beginPath()
      ctx.arc(centerX, bulbCenterY, bulbRadius - 3, 0, Math.PI * 2)
      ctx.fillStyle = fillColor
      ctx.fill()
    }

    // Draw temperature markings
    for (let i = 0; i <= 100; i += 20) {
      const y = tubeTopY + ((100 - i) / 100) * tubeHeight

      // Draw longer line for each 20%
      ctx.beginPath()
      ctx.moveTo(centerX - tubeWidth / 2 - 10, y)
      ctx.lineTo(centerX - tubeWidth / 2, y)
      ctx.lineWidth = 2
      ctx.strokeStyle = "#334155"
      ctx.stroke()

      // Add percentage text
      ctx.font = "14px Arial"
      ctx.fillStyle = "#334155"
      ctx.textAlign = "right"
      ctx.fillText(`${i}%`, centerX - tubeWidth / 2 - 15, y + 5)
    }

    // Draw shorter lines for each 10%
    for (let i = 10; i < 100; i += 20) {
      const y = tubeTopY + ((100 - i) / 100) * tubeHeight

      ctx.beginPath()
      ctx.moveTo(centerX - tubeWidth / 2 - 5, y)
      ctx.lineTo(centerX - tubeWidth / 2, y)
      ctx.lineWidth = 1
      ctx.strokeStyle = "#334155"
      ctx.stroke()
    }

    // Add score text
    ctx.font = "bold 18px Arial"
    ctx.fillStyle = "#1e293b" // slate-800
    ctx.textAlign = "center"
    ctx.fillText(`Score: ${percentage.toFixed(1)}%`, centerX, tubeTopY - 30)

    // Add severity level
    ctx.font = "bold 20px Arial"
    ctx.fillStyle = "#1e293b" // slate-800
    ctx.textAlign = "center"
    ctx.fillText(`${severity.toUpperCase()} SEVERITY`, centerX, tubeTopY - 60)
  }

  return (
    <div className="flex justify-center items-center">
      <canvas ref={canvasRef} className="max-w-full h-auto" style={{ maxHeight: "500px" }} />
    </div>
  )
}
