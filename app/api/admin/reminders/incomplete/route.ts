import { getIncompleteAssessmentsForReminders } from "@/lib/supabase/reminder-service"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "0", 10) || undefined
    const maxReminders = Number.parseInt(searchParams.get("maxReminders") || "0", 10) || undefined

    const incompleteAssessments = await getIncompleteAssessmentsForReminders(days, maxReminders)

    return NextResponse.json(incompleteAssessments)
  } catch (error) {
    console.error("Error in incomplete assessments API:", error)
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
