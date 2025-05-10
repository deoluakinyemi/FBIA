import { NextResponse } from "next/server"
import { getFooterSettings, updateFooterSettings } from "@/lib/supabase/footer-service"

export async function GET() {
  try {
    const settings = await getFooterSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching footer settings:", error)
    return NextResponse.json({ error: "Failed to fetch footer settings" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const settings = await request.json()
    const updatedSettings = await updateFooterSettings(settings)
    return NextResponse.json(updatedSettings)
  } catch (error) {
    console.error("Error updating footer settings:", error)
    return NextResponse.json({ error: "Failed to update footer settings" }, { status: 500 })
  }
}
