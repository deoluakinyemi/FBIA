import { getReminderStatistics } from "@/lib/supabase/reminder-service"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const statistics = await getReminderStatistics()

    if (!statistics) {
      return NextResponse.json({ success: false, message: "Failed to fetch reminder statistics" }, { status: 500 })
    }

    return NextResponse.json(statistics)
  } catch (error) {
    console.error("Error in reminder statistics API:", error)
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
