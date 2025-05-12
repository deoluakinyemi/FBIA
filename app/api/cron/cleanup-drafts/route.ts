import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Number of days after which drafts are considered expired
const DRAFT_EXPIRATION_DAYS = 30

export async function GET(request: Request) {
  try {
    // Check for secret token to prevent unauthorized access
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get("secret")

    // Verify the secret matches the environment variable
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const supabase = createServerClient()

    // Calculate the cutoff date (30 days ago by default)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - DRAFT_EXPIRATION_DAYS)
    const cutoffDateString = cutoffDate.toISOString()

    // Delete drafts older than the cutoff date
    const { data, error, count } = await supabase
      .from("draft_assessments")
      .delete()
      .lt("last_updated", cutoffDateString)
      .select("id")

    if (error) {
      console.error("Error deleting expired drafts:", error)
      return NextResponse.json({ success: false, message: "Failed to delete expired drafts", error }, { status: 500 })
    }

    // Log the number of deleted drafts
    console.log(`Successfully deleted ${count || 0} expired draft assessments`)

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${count || 0} expired draft assessments`,
      deletedDrafts: data || [],
    })
  } catch (error) {
    console.error("Unexpected error in cleanup-drafts:", error)
    return NextResponse.json({ success: false, message: "Internal server error", error }, { status: 500 })
  }
}
