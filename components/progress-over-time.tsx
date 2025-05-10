"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProgressChart } from "@/components/progress-chart"
import { getPillarProgressOverTime } from "@/lib/supabase/progress-service"

interface ProgressOverTimeProps {
  userId: string
  pillars: any[]
}

export function ProgressOverTime({ userId, pillars }: ProgressOverTimeProps) {
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null)
  const [progressData, setProgressData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  })

  useEffect(() => {
    if (pillars.length > 0 && !selectedPillar) {
      setSelectedPillar(pillars[0].id)
    }
  }, [pillars, selectedPillar])

  useEffect(() => {
    async function loadProgressData() {
      if (!selectedPillar) return

      setLoading(true)
      try {
        const data = await getPillarProgressOverTime(userId, selectedPillar)
        setProgressData(data)

        // Format data for chart
        const labels = data.map((item) => new Date(item.date).toLocaleDateString())
        const scores = data.map((item) => Math.round(item.score * 10)) // Convert to 0-10 scale

        const selectedPillarObj = pillars.find((p) => p.id === selectedPillar)
        const pillarName = selectedPillarObj ? selectedPillarObj.name : "Selected Pillar"

        setChartData({
          labels,
          datasets: [
            {
              label: pillarName,
              data: scores,
              borderColor: "rgb(99, 102, 241)",
              backgroundColor: "rgba(99, 102, 241, 0.2)",
              tension: 0.3,
            },
          ],
        })
      } catch (error) {
        console.error("Error loading progress data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProgressData()
  }, [userId, selectedPillar, pillars])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Over Time</CardTitle>
        <CardDescription>Track how your financial health is improving</CardDescription>
        <div className="mt-2">
          <Select value={selectedPillar || ""} onValueChange={setSelectedPillar}>
            <SelectTrigger>
              <SelectValue placeholder="Select a financial pillar" />
            </SelectTrigger>
            <SelectContent>
              {pillars.map((pillar) => (
                <SelectItem key={pillar.id} value={pillar.id}>
                  {pillar.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <p>Loading progress data...</p>
          </div>
        ) : progressData.length < 2 ? (
          <div className="h-80 flex items-center justify-center text-center">
            <p className="text-muted-foreground">Complete at least two assessments to see your progress over time.</p>
          </div>
        ) : (
          <div className="h-80">
            <ProgressChart data={chartData} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
