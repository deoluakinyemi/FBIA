import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PillarScoreCardProps {
  pillar: string
  score: number
  recommendations: string[]
  className?: string
}

export function PillarScoreCard({ pillar, score, recommendations, className = "" }: PillarScoreCardProps) {
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
    if (score >= 0.6) return "text-nairawise-medium"
    if (score >= 0.4) return "text-amber-600"
    if (score >= 0.2) return "text-orange-600"
    return "text-red-600"
  }

  return (
    <Card className={`nairawise-shadow ${className}`}>
      <CardHeader className="pb-2 bg-nairawise-cream">
        <CardTitle className="text-nairawise-dark">{pillarTitles[pillar] || pillar}</CardTitle>
        <CardDescription className="flex justify-between items-center">
          <span className="text-nairawise-dark/70">Your score</span>
          <span className={`font-medium ${scoreColor()}`}>
            {Math.round(score * 10)}/10 - {scoreText()}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-nairawise-dark">Recommendations:</h4>
          <ul className="text-sm space-y-1">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="list-disc ml-5 text-nairawise-dark/70">
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
