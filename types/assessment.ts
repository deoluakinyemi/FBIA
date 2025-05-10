export interface AssessmentData {
  id: string
  userId: string
  userName: string
  userEmail: string
  overallScore: number
  pillarScores: Record<string, number>
  recommendations: Record<string, string[]>
  completedAt: string
}
