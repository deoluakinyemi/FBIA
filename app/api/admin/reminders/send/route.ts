import { getIncompleteAssessmentsForReminders, sendReminderEmails } from "@/lib/supabase/reminder-service"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "3", 10)
    const maxReminders = Number.parseInt(searchParams.get("maxReminders") || "3", 10)
    const batchSize = Number.parseInt(searchParams.get("batchSize") || "50", 10)

    // Get incomplete assessments that need reminders
    const incompleteAssessments = await getIncompleteAssessmentsForReminders(days, maxReminders)

    // If no assessments need reminders, return early
    if (incompleteAssessments.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No incomplete assessments found that need reminders",
        count: 0,
      })
    }

    // Limit the number of emails sent in one batch
    const assessmentsToProcess = incompleteAssessments.slice(0, batchSize)

    // Send reminder emails
    const results = await sendReminderEmails(assessmentsToProcess)

    return NextResponse.json({
      success: true,
      message: `Processed ${results.totalProcessed} reminder emails`,
      ...results,
    })
  } catch (error) {
    console.error("Error in send reminders API:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
