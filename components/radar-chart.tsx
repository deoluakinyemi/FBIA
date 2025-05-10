"use client"

import { useEffect, useRef } from "react"
import { Chart, type ChartConfiguration, RadarController, RadialLinearScale, PointElement, LineElement } from "chart.js"

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement)

interface RadarChartProps {
  scores: Record<string, number>
}

export function RadarChart({ scores }: RadarChartProps) {
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

    const pillarLabels = {
      awareness: "Financial Awareness",
      goals: "Goal Setting",
      habits: "Financial Habits",
      mindsets: "Money Mindsets",
      assets: "Asset Building",
      liabilities: "Liability Management",
      income: "Income Streams",
      expenses: "Expense Control",
    }

    const data = {
      labels: Object.keys(scores).map((key) => pillarLabels[key as keyof typeof pillarLabels] || key),
      datasets: [
        {
          label: "Your Score",
          data: Object.values(scores).map((score) => score * 10), // Convert to 0-10 scale
          backgroundColor: "rgba(99, 102, 241, 0.2)",
          borderColor: "rgb(99, 102, 241)",
          borderWidth: 2,
          pointBackgroundColor: "rgb(99, 102, 241)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgb(99, 102, 241)",
        },
      ],
    }

    const config: ChartConfiguration = {
      type: "radar",
      data,
      options: {
        scales: {
          r: {
            min: 0,
            max: 10,
            ticks: {
              stepSize: 2,
            },
          },
        },
        elements: {
          line: {
            tension: 0.1,
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
  }, [scores])

  return <canvas ref={chartRef} />
}
