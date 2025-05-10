import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from("footer_quick_links")
      .select("*")
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching footer links:", error)
      return NextResponse.json(
        [
          { id: "1", title: "Home", url: "/", display_order: 1 },
          { id: "2", title: "Take Assessment", url: "/assessment/start", display_order: 2 },
          { id: "3", title: "Dashboard", url: "/dashboard", display_order: 3 },
          { id: "4", title: "Resources", url: "/resources", display_order: 4 },
          { id: "5", title: "About Us", url: "/about", display_order: 5 },
        ],
        { status: 200 },
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Server error fetching footer links:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
