"use client"

import { useEffect, useRef } from "react"
import { Chart, type ChartConfiguration, BarController, CategoryScale, LinearScale, BarElement } from "chart.js"

Chart.register(BarController, CategoryScale, LinearScale, BarElement)

interface BarChartProps {
  data: { pillar: string; avgScore: number }[]
}

export function BarChartComponent({ data }: BarChartProps) {
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

    const chartData = {
      labels: data.map((item) => item.pillar),
      datasets: [
        {
          label: "Average Score",
          data: data.map((item) => item.avgScore),
          backgroundColor: "rgba(99, 102, 241, 0.7)",
          borderColor: "rgb(99, 102, 241)",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    }

    const config: ChartConfiguration = {
      type: "bar",
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
            max: 10,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
            ticks: {
              callback: (value) => value + "/10",
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
