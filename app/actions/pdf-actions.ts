"use server"

import { generateAssessmentPDF } from "@/lib/pdf-service"
import { getAssessmentDetails } from "@/lib/supabase/assessment-service"
import { getRecommendations } from "@/lib/scoring"

export async function generatePDFReport(assessmentId: string) {
  try {
    // Get assessment details
    const assessmentDetails = await getAssessmentDetails(assessmentId)

    if (!assessmentDetails) {
      throw new Error("Assessment not found")
    }

    // Process pillar scores
    const pillarScores: Record<string, number> = {}
    assessmentDetails.pillarScores.forEach((score: any) => {
      const pillarSlug = score.pillars?.slug || ""
      pillarScores[pillarSlug] = score.score
    })

    // Get recommendations
    const recommendations = getRecommendations(pillarScores)

    // Prepare assessment data for PDF generation
    const assessmentData = {
      id: assessmentDetails.id,
      userId: assessmentDetails.user_id,
      userName: assessmentDetails.users?.name || "User",
      userEmail: assessmentDetails.users?.email || "",
      overallScore: assessmentDetails.overall_score || 0,
      pillarScores,
      recommendations,
      completedAt: assessmentDetails.completed_at,
    }

    // Generate PDF
    const pdfBlob = await generateAssessmentPDF(assessmentData)

    // Convert blob to base64 for transfer to client
    const buffer = await pdfBlob.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")

    return { success: true, pdf: base64 }
  } catch (error) {
    console.error("Error generating PDF:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate PDF report",
    }
  }
}
