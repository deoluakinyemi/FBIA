"use server"

import { sendAssessmentResultsEmail } from "@/lib/supabase/assessment-service"

export async function sendAssessmentEmail(assessmentId: string) {
  try {
    const result = await sendAssessmentResultsEmail(assessmentId)
    return { success: true, result }
  } catch (error) {
    console.error("Error in sendAssessmentEmail action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
