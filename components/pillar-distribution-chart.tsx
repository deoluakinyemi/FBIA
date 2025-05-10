"use client"

import { useEffect, useRef } from "react"
import { Chart, type ChartConfiguration, PolarAreaController, RadialLinearScale, ArcElement } from "chart.js"

Chart.register(PolarAreaController, RadialLinearScale, ArcElement)

interface PillarDistributionChartProps {
  data: { pillar: string; avgScore: number }[]
}

export function PillarDistributionChart({ data }: PillarDistributionChartProps) {
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

    // Generate colors for each pillar
    const colors = [
      "rgba(99, 102, 241, 0.7)", // Indigo
      "rgba(79, 70, 229, 0.7)", // Indigo darker
      "rgba(59, 130, 246, 0.7)", // Blue
      "rgba(16, 185, 129, 0.7)", // Emerald
      "rgba(245, 158, 11, 0.7)", // Amber
      "rgba(239, 68, 68, 0.7)", // Red
      "rgba(168, 85, 247, 0.7)", // Purple
      "rgba(236, 72, 153, 0.7)", // Pink
    ]

    const chartData = {
      labels: data.map((item) => item.pillar),
      datasets: [
        {
          data: data.map((item) => item.avgScore),
          backgroundColor: colors.slice(0, data.length),
          borderWidth: 1,
          borderColor: colors.slice(0, data.length).map((color) => color.replace("0.7", "1")),
        },
      ],
    }

    const config: ChartConfiguration = {
      type: "polarArea",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            max: 10,
            ticks: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            position: "right",
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
