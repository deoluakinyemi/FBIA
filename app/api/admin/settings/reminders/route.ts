import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.from("settings").select("*").eq("key", "reminder_settings").maybeSingle()

    if (error) {
      console.error("Error fetching reminder settings:", error)
      return NextResponse.json({ success: false, message: "Failed to fetch reminder settings" }, { status: 500 })
    }

    // Return default settings if none exist
    if (!data) {
      const defaultSettings = {
        daysSinceLastUpdate: 3,
        maxReminders: 3,
        batchSize: 50,
        enabled: true,
        sendTime: "03:00",
      }

      return NextResponse.json(defaultSettings)
    }

    return NextResponse.json(data.value)
  } catch (error) {
    console.error("Error in reminder settings GET API:", error)
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

export async function PUT(request: Request) {
  try {
    const supabase = createServerClient()
    const settings = await request.json()

    // Validate settings
    if (
      typeof settings.daysSinceLastUpdate !== "number" ||
      typeof settings.maxReminders !== "number" ||
      typeof settings.batchSize !== "number"
    ) {
      return NextResponse.json({ success: false, message: "Invalid settings format" }, { status: 400 })
    }

    // Check if settings already exist
    const { data: existingSettings, error: fetchError } = await supabase
      .from("settings")
      .select("id")
      .eq("key", "reminder_settings")
      .maybeSingle()

    if (fetchError) {
      console.error("Error fetching existing reminder settings:", fetchError)
      return NextResponse.json({ success: false, message: "Failed to check existing settings" }, { status: 500 })
    }

    let result

    if (existingSettings) {
      // Update existing settings
      const { error: updateError } = await supabase
        .from("settings")
        .update({ value: settings })
        .eq("key", "reminder_settings")

      if (updateError) {
        console.error("Error updating reminder settings:", updateError)
        return NextResponse.json({ success: false, message: "Failed to update reminder settings" }, { status: 500 })
      }

      result = { success: true, message: "Reminder settings updated successfully" }
    } else {
      // Create new settings
      const { error: insertError } = await supabase
        .from("settings")
        .insert({ key: "reminder_settings", value: settings })

      if (insertError) {
        console.error("Error creating reminder settings:", insertError)
        return NextResponse.json({ success: false, message: "Failed to create reminder settings" }, { status: 500 })
      }

      result = { success: true, message: "Reminder settings created successfully" }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in reminder settings PUT API:", error)
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
