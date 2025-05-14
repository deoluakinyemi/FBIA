import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PillarScoreCardProps {
  pillar: string
  title?: string
  score: number
  recommendations?: string[]
}

export function PillarScoreCard({ pillar, title, score, recommendations = [] }: PillarScoreCardProps) {
  // Map pillar slugs to display names if title is not provided
  const getPillarTitle = (pillarSlug: string): string => {
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
    return pillarTitles[pillarSlug] || pillarSlug
  }

  const displayTitle = title || getPillarTitle(pillar)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>{displayTitle}</span>
          <span
            className={`text-xl font-bold ${
              score >= 7 ? "text-green-600" : score >= 4 ? "text-amber-600" : "text-red-600"
            }`}
          >
            {score.toFixed(1)}/10
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recommendations && recommendations.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Recommendations:</h4>
            <ul className="text-sm space-y-1 list-disc pl-4">
              {recommendations.slice(0, 3).map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
