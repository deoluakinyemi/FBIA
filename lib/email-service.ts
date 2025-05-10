import { Resend } from "resend"
import { AssessmentResultsEmail } from "@/components/emails/assessment-results-email"

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Function to send assessment results email
export async function sendAssessmentResultsEmail(
  userEmail: string,
  userName: string,
  assessmentId: string,
  overallScore: number,
) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const { data, error } = await resend.emails.send({
      from: "Financial Assessment <assessment@yourdomain.com>",
      to: userEmail,
      subject: "Your Financial Health Assessment Results",
      react: AssessmentResultsEmail({
        userName,
        overallScore,
        assessmentUrl: `${appUrl}/assessment/results?id=${assessmentId}`,
      }),
    })

    if (error) {
      console.error("Error sending email:", error)
      throw new Error(error.message)
    }

    return { success: true, data }
  } catch (error) {
    console.error("Failed to send email:", error)
    throw error
  }
}
