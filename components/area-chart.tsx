"use client"

import { useEffect, useRef } from "react"
import {
  Chart,
  type ChartConfiguration,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js"

Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Filler)

interface AreaChartProps {
  data: { date: string; count: number }[]
}

export function AreaChart({ data }: AreaChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, 400)
    gradient.addColorStop(0, "rgba(99, 102, 241, 0.3)")
    gradient.addColorStop(1, "rgba(99, 102, 241, 0.0)")

    const chartData = {
      labels: data.map((item) => {
        const date = new Date(item.date)
        return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
      }),
      datasets: [
        {
          label: "Assessments",
          data: data.map((item) => item.count),
          borderColor: "rgb(99, 102, 241)",
          backgroundColor: gradient,
          tension: 0.3,
          fill: true,
          pointBackgroundColor: "rgb(99, 102, 241)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgb(99, 102, 241)",
        },
      ],
    }

    const config: ChartConfiguration = {
      type: "line",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    }

    chartInstance.current = new Chart(ctx, config)

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return <canvas ref={chartRef} />
}
