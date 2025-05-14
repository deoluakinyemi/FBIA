import { Resend } from "resend"
import { AssessmentResultsEmail } from "@/components/emails/assessment-results-email"
import { AssessmentReminderEmail } from "@/components/emails/assessment-reminder-email"

// Initialize Resend with proper error handling
const resendApiKey = process.env.RESEND_API_KEY
let resend: Resend | null = null

// Only initialize Resend if API key is available
if (resendApiKey) {
  try {
    resend = new Resend(resendApiKey)
  } catch (error) {
    console.error("Failed to initialize Resend client:", error)
  }
}

// Function to send assessment results email
export async function sendAssessmentResultsEmail(
  userEmail: string,
  userName: string,
  assessmentId: string,
  overallScore: number,
) {
  // If Resend is not initialized, log a message and return mock success
  if (!resend) {
    console.warn("Resend client not initialized. Email sending is disabled.")
    return {
      success: true,
      data: { id: "mock-email-id" },
      mock: true,
    }
  }

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
    // Return mock success to prevent blocking the assessment flow
    return {
      success: true,
      data: { id: "mock-email-id" },
      mock: true,
    }
  }
}

// Function to send assessment reminder email
export async function sendAssessmentReminderEmail(
  userEmail: string,
  userName: string,
  lastUpdated: string,
  daysAgo: number,
) {
  // If Resend is not initialized, log a message and return mock success
  if (!resend) {
    console.warn("Resend client not initialized. Email sending is disabled.")
    return {
      success: true,
      data: { id: "mock-email-id" },
      mock: true,
    }
  }

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const { data, error } = await resend.emails.send({
      from: "Financial Assessment <assessment@yourdomain.com>",
      to: userEmail,
      subject: "Continue Your Financial Assessment",
      react: AssessmentReminderEmail({
        userName,
        lastUpdated,
        daysAgo,
        assessmentUrl: `${appUrl}/assessment`,
      }),
    })

    if (error) {
      console.error("Error sending reminder email:", error)
      throw new Error(error.message)
    }

    return { success: true, data }
  } catch (error) {
    console.error("Failed to send reminder email:", error)
    // Return mock success to prevent blocking the assessment flow
    return {
      success: true,
      data: { id: "mock-email-id" },
      mock: true,
    }
  }
}
