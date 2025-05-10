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
          backgroundColor: "rgba(10, 77, 60, 0.2)", // NairaWise dark green with opacity
          borderColor: "#0A4D3C", // NairaWise dark green
          borderWidth: 2,
          pointBackgroundColor: "#0A4D3C", // NairaWise dark green
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#0A4D3C", // NairaWise dark green
        },
        {
          label: "Target Score",
          data: Array(Object.keys(scores).length).fill(8), // Target score of 8/10
          backgroundColor: "rgba(212, 185, 94, 0.1)", // NairaWise gold with opacity
          borderColor: "#D4B95E", // NairaWise gold
          borderWidth: 2,
          pointBackgroundColor: "#D4B95E", // NairaWise gold
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#D4B95E", // NairaWise gold
          borderDash: [5, 5], // Dashed line for target
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
              color: "#0A4D3C", // NairaWise dark green
            },
            pointLabels: {
              color: "#0A4D3C", // NairaWise dark green
              font: {
                weight: "bold",
              },
            },
            grid: {
              color: "rgba(106, 155, 94, 0.2)", // NairaWise medium green with opacity
            },
            angleLines: {
              color: "rgba(106, 155, 94, 0.3)", // NairaWise medium green with opacity
            },
          },
        },
        elements: {
          line: {
            tension: 0.1,
          },
        },
        plugins: {
          legend: {
            labels: {
              color: "#0A4D3C", // NairaWise dark green
              font: {
                weight: "bold",
              },
            },
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
