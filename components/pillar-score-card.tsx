import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PillarScoreCardProps {
  pillar: string
  score: number
  recommendations: string[]
}

export function PillarScoreCard({ pillar, score, recommendations }: PillarScoreCardProps) {
  const pillarTitles: Record<string, string> = {
    awareness: "Financial Awareness",
    goals: "Goal Setting",
    habits: "Financial Habits",
    mindsets: "Money Mindsets",
    assets: "Asset Building",
    liabilities: "Liability Management",
    income: "Income Streams",
    expenses: "Expense Control",
  }

  const scoreText = (): string => {
    if (score >= 0.8) return "Excellent"
    if (score >= 0.6) return "Good"
    if (score >= 0.4) return "Fair"
    if (score >= 0.2) return "Needs Work"
    return "Critical"
  }

  const scoreColor = (): string => {
    if (score >= 0.8) return "text-green-600"
    if (score >= 0.6) return "text-emerald-600"
    if (score >= 0.4) return "text-amber-600"
    if (score >= 0.2) return "text-orange-600"
    return "text-red-600"
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{pillarTitles[pillar] || pillar}</CardTitle>
        <CardDescription className="flex justify-between items-center">
          <span>Your score</span>
          <span className={`font-medium ${scoreColor()}`}>
            {Math.round(score * 10)}/10 - {scoreText()}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Recommendations:</h4>
          <ul className="text-sm space-y-1">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="list-disc ml-5">
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
