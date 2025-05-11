import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { sendAssessmentResultsEmail } from "@/lib/email-service"

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()

    // Get assessment details
    const { data: assessment, error } = await supabase
      .from("assessments")
      .select(`
        *,
        users (
          id,
          name,
          email
        )
      `)
      .eq("id", params.id)
      .single()

    if (error) {
      console.error("Error fetching assessment:", error)
      return NextResponse.json({ error: "Failed to fetch assessment" }, { status: 500 })
    }

    if (!assessment.users?.email) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 })
    }

    // Send email
    await sendAssessmentResultsEmail(
      assessment.users.email,
      assessment.users.name || "User",
      assessment.id,
      assessment.overall_score,
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending assessment email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
