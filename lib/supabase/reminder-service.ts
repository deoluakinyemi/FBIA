import { createServerClient } from "./server"
import { sendAssessmentReminderEmail } from "../email-service"

// Interface for incomplete assessment data
export interface IncompleteAssessment {
  id: string
  userId: string
  userName: string
  userEmail: string
  lastUpdated: string
  daysAgo: number
  remindersSent: number
}

// Get all incomplete assessments that need reminders
export async function getIncompleteAssessmentsForReminders(daysSinceLastUpdate = 3, maxReminders = 3) {
  try {
    const supabase = createServerClient()

    // Calculate the cutoff date
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysSinceLastUpdate)
    const cutoffDateString = cutoffDate.toISOString()

    // Get draft assessments that haven't been updated since the cutoff date
    // and join with users table to get user information
    const { data, error } = await supabase
      .from("draft_assessments")
      .select(`
        id,
        user_id,
        last_updated,
        reminders_sent,
        users (
          id,
          name,
          email
        )
      `)
      .lt("last_updated", cutoffDateString)
      .lte("reminders_sent", maxReminders)

    if (error) {
      console.error("Error fetching incomplete assessments:", error)
      return []
    }

    // Format the data for easier use
    const incompleteAssessments: IncompleteAssessment[] = data
      .filter((item) => item.users && item.users.email) // Ensure user has an email
      .map((item) => {
        const lastUpdated = new Date(item.last_updated)
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - lastUpdated.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        return {
          id: item.id,
          userId: item.user_id,
          userName: item.users?.name || "User",
          userEmail: item.users?.email || "",
          lastUpdated: item.last_updated,
          daysAgo: diffDays,
          remindersSent: item.reminders_sent || 0,
        }
      })

    return incompleteAssessments
  } catch (error) {
    console.error("Unexpected error in getIncompleteAssessmentsForReminders:", error)
    return []
  }
}

// Send reminder emails for incomplete assessments
export async function sendReminderEmails(assessments: IncompleteAssessment[]) {
  const supabase = createServerClient()
  const results = []

  for (const assessment of assessments) {
    try {
      // Send the reminder email
      const emailResult = await sendAssessmentReminderEmail(
        assessment.userEmail,
        assessment.userName,
        assessment.lastUpdated,
        assessment.daysAgo,
      )

      // Update the reminders_sent count in the database
      const { error } = await supabase
        .from("draft_assessments")
        .update({
          reminders_sent: assessment.remindersSent + 1,
          last_reminder_sent: new Date().toISOString(),
        })
        .eq("id", assessment.id)

      if (error) {
        console.error(`Error updating reminder count for assessment ${assessment.id}:`, error)
        results.push({
          id: assessment.id,
          success: false,
          error: error.message,
        })
        continue
      }

      results.push({
        id: assessment.id,
        success: true,
        emailId: emailResult.data?.id || "mock-email-id",
      })
    } catch (error) {
      console.error(`Error sending reminder for assessment ${assessment.id}:`, error)
      results.push({
        id: assessment.id,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  return {
    totalProcessed: assessments.length,
    successCount: results.filter((r) => r.success).length,
    failureCount: results.filter((r) => !r.success).length,
    results,
  }
}

// Get reminder statistics
export async function getReminderStatistics() {
  try {
    const supabase = createServerClient()

    // Get count of all draft assessments
    const { count: totalDrafts, error: countError } = await supabase
      .from("draft_assessments")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("Error counting draft assessments:", countError)
      return null
    }

    // Get count of drafts with reminders sent
    const { count: draftsWithReminders, error: reminderError } = await supabase
      .from("draft_assessments")
      .select("*", { count: "exact", head: true })
      .gt("reminders_sent", 0)

    if (reminderError) {
      console.error("Error counting drafts with reminders:", reminderError)
      return null
    }

    // Get count of drafts that were completed after reminders
    const { data: completedAfterReminder, error: completedError } = await supabase
      .from("assessments")
      .select(`
        id,
        completed_at,
        user_id
      `)
      .gt("completed_after_reminder", 0)

    if (completedError) {
      console.error("Error counting completed assessments after reminders:", completedError)
      return null
    }

    return {
      totalDrafts: totalDrafts || 0,
      draftsWithReminders: draftsWithReminders || 0,
      completedAfterReminder: completedAfterReminder?.length || 0,
      conversionRate: totalDrafts ? (completedAfterReminder?.length || 0) / totalDrafts : 0,
    }
  } catch (error) {
    console.error("Unexpected error in getReminderStatistics:", error)
    return null
  }
}
