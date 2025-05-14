export function calculateScores(
  answers: Record<string, { questionId: string; optionId: string; score: number }>,
): Record<string, number> {
  // Define the exact pillar slugs as they appear in the question IDs
  const pillars = ["awareness", "goals", "habits", "mindsets", "assets", "liabilities", "income", "expenses"]

  const scores: Record<string, number> = {}

  // Calculate score for each pillar
  pillars.forEach((pillar) => {
    let pillarTotal = 0
    let questionCount = 0

    // Find all answers for this pillar
    Object.entries(answers).forEach(([questionId, answer]) => {
      if (questionId.startsWith(`${pillar}-`)) {
        // The score in the answer is already between 0 and 1 (e.g., 0.1, 0.3, 0.5, 0.7, 0.9)
        // We need to multiply by 10 to get a score out of 10
        pillarTotal += answer.score * 10
        questionCount++
      }
    })

    // Calculate average score for this pillar (out of 10)
    if (questionCount > 0) {
      scores[pillar] = pillarTotal / questionCount
    } else {
      scores[pillar] = 0
    }
  })

  // Log the scores to help with debugging
  console.log("Calculated scores:", scores)

  return scores
}

export function getRecommendations(scores: Record<string, number>): Record<string, string[]> {
  const recommendations: Record<string, string[]> = {}

  // Awareness recommendations
  if (scores.awareness < 6) {
    recommendations.awareness = [
      "Set up a system to track all your income and expenses",
      "Schedule monthly financial review sessions",
      "Subscribe to financial news sources or podcasts",
      "Take a basic financial literacy course",
      "Create a detailed list of all your assets and liabilities",
    ]
  } else {
    recommendations.awareness = [
      "Deepen your understanding of advanced financial concepts",
      "Set up more detailed tracking of investment performance",
      "Analyze economic trends that might affect your specific financial situation",
      "Consider working with a financial advisor for specialized knowledge",
    ]
  }

  // Goals recommendations
  if (scores.goals < 6) {
    recommendations.goals = [
      "Define 3-5 specific, measurable financial goals with deadlines",
      "Break down each goal into smaller, actionable steps",
      "Create a vision board or written statement about your financial future",
      "Schedule quarterly reviews of your progress toward goals",
      "Adjust unrealistic goals to be challenging but achievable",
    ]
  } else {
    recommendations.goals = [
      "Create more detailed implementation plans for each goal",
      "Set up automated systems to support your goals",
      "Add stretch goals to push your financial growth",
      "Develop contingency plans for potential obstacles",
    ]
  }

  // Habits recommendations
  if (scores.habits < 6) {
    recommendations.habits = [
      "Set up automatic transfers to savings on payday",
      "Implement a 24-hour rule before making non-essential purchases",
      "Track all spending for 30 days to identify patterns",
      "Schedule 15 minutes weekly for financial management",
      "Create a system for handling financial windfalls before they occur",
    ]
  } else {
    recommendations.habits = [
      "Optimize your financial automation systems",
      "Develop more sophisticated tracking methods",
      "Create accountability systems for your financial habits",
      "Share your knowledge by mentoring others",
    ]
  }

  // Mindsets recommendations
  if (scores.mindsets < 6) {
    recommendations.mindsets = [
      "Read books on financial mindset and psychology of money",
      "Practice gratitude for your current financial situation while working to improve it",
      "Challenge negative beliefs about money with evidence",
      "Find role models who have achieved what you want to achieve",
      "Journal about your emotional reactions to financial events",
    ]
  } else {
    recommendations.mindsets = [
      "Mentor others on developing healthy money mindsets",
      "Explore more advanced wealth psychology concepts",
      "Challenge yourself to take calculated financial risks",
      "Develop systems to maintain optimism during market downturns",
    ]
  }

  // Assets recommendations
  if (scores.assets < 6) {
    recommendations.assets = [
      "Start investing regularly, even with small amounts",
      "Learn about different asset classes and their characteristics",
      "Set up automatic investments into index funds or other diversified assets",
      "Explore ways to generate passive income from your skills or resources",
      "Create a plan to gradually increase your investment percentage",
    ]
  } else {
    recommendations.assets = [
      "Optimize your asset allocation for your specific goals",
      "Explore more sophisticated investment strategies",
      "Consider alternative investments to further diversify",
      "Develop systems to increase your passive income streams",
    ]
  }

  // Liabilities recommendations
  if (scores.liabilities < 6) {
    recommendations.liabilities = [
      "List all debts with interest rates and minimum payments",
      "Create a debt repayment strategy (snowball or avalanche method)",
      "Consolidate high-interest debt if possible",
      "Negotiate with creditors for better terms",
      "Develop criteria for when to take on new debt",
    ]
  } else {
    recommendations.liabilities = [
      "Optimize your debt repayment strategy",
      "Consider leveraging strategic debt for asset acquisition",
      "Refinance existing debt to better terms",
      "Develop a more sophisticated approach to using credit",
    ]
  }

  // Income recommendations
  if (scores.income < 6) {
    recommendations.income = [
      "Identify skills you can develop to increase your primary income",
      "Explore side hustle opportunities aligned with your skills",
      "Network strategically in your industry",
      "Research salary ranges for your position and prepare for negotiation",
      "Set specific income growth targets for 1, 3, and 5 years",
    ]
  } else {
    recommendations.income = [
      "Develop more passive income streams",
      "Consider entrepreneurial opportunities",
      "Optimize your existing income streams for efficiency",
      "Explore ways to scale your highest-performing income sources",
    ]
  }

  // Expenses recommendations
  if (scores.expenses < 6) {
    recommendations.expenses = [
      "Create a detailed budget aligned with your values",
      "Identify and eliminate unnecessary recurring expenses",
      "Implement a category-based spending plan",
      "Practice zero-based budgeting for one month",
      "Audit your subscriptions and memberships",
    ]
  } else {
    recommendations.expenses = [
      "Optimize spending to maximize value rather than just cutting costs",
      "Implement more sophisticated budgeting techniques",
      "Develop systems to automatically categorize and analyze expenses",
      "Create spending policies for different areas of your life",
    ]
  }

  return recommendations
}
