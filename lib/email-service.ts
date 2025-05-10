import { Resend } from "resend"
import { AssessmentResultsEmail } from "@/components/emails/assessment-results-email"
import { renderAsync } from "@react-email/components"

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

export type AssessmentEmailData = {
  userName: string
  userEmail: string
  overallScore: number
  pillarScores: Record<string, number>
  assessmentId: string
  completedAt: string
}

export async function sendAssessmentResultsEmail(data: AssessmentEmailData) {
  try {
    // Render the React email template to HTML
    const html = await renderAsync(AssessmentResultsEmail(data))

    // Send the email
    const { data: emailData, error } = await resend.emails.send({
      from: "Financial Assessment <assessment@yourdomain.com>",
      to: data.userEmail,
      subject: "Your Financial Assessment Results",
      html: html,
    })

    if (error) {
      console.error("Error sending email:", error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    return { success: true, messageId: emailData?.id }
  } catch (error) {
    console.error("Error in sendAssessmentResultsEmail:", error)
    throw error
  }
}
