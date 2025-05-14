import { ResponsiveRadar } from "@nivo/radar"

interface RadarChartProps {
  scores: Record<string, number>
}

export function RadarChart({ scores }: RadarChartProps) {
  // Define the consistent order of pillars
  const pillarOrder = ["awareness", "goals", "habits", "mindsets", "assets", "liabilities", "income", "expenses"]

  // Map pillar slugs to display names
  const pillarNames: Record<string, string> = {
    awareness: "Financial Awareness",
    goals: "Goal Setting",
    habits: "Financial Habits",
    mindsets: "Money Mindsets",
    assets: "Asset Building",
    liabilities: "Liability Management",
    income: "Income Streams",
    expenses: "Expense Control",
  }

  // Transform scores into the format expected by the radar chart
  const data = pillarOrder.map((key) => ({
    pillar: pillarNames[key] || key,
    score: scores[key] || 0,
  }))

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <ResponsiveRadar
        data={data}
        keys={["score"]}
        indexBy="pillar"
        maxValue={10}
        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
        borderColor={{ from: "color" }}
        gridLabelOffset={36}
        dotSize={10}
        dotColor={{ theme: "background" }}
        dotBorderWidth={2}
        colors={{ scheme: "category10" }}
        blendMode="multiply"
        motionConfig="wobbly"
        legends={[
          {
            anchor: "top-left",
            direction: "column",
            translateX: -50,
            translateY: -40,
            itemWidth: 80,
            itemHeight: 20,
            itemTextColor: "#999",
            symbolSize: 12,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]}
      />
    </div>
  )
}
