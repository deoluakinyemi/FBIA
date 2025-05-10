"use server"

import { sendAssessmentResultsEmail as sendEmail } from "@/lib/email-service"
import { getAssessmentDetails } from "@/lib/supabase/assessment-service"

export async function sendAssessmentEmail(assessmentId: string) {
  try {
    // Get assessment details
    const assessmentDetails = await getAssessmentDetails(assessmentId)

    if (!assessmentDetails) {
      return { success: false, error: "Assessment not found" }
    }

    // Check if user has email
    if (!assessmentDetails.users?.email) {
      return { success: false, error: "User email not found" }
    }

    // Send email
    await sendEmail(
      assessmentDetails.users.email,
      assessmentDetails.users.name || "User",
      assessmentId,
      assessmentDetails.overall_score,
    )

    return { success: true }
  } catch (error) {
    console.error("Error sending assessment email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send assessment email",
    }
  }
}
