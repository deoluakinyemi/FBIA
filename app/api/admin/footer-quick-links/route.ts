import { NextResponse } from "next/server"
import { getQuickLinks, addQuickLink } from "@/lib/supabase/footer-service"

export async function GET() {
  try {
    const links = await getQuickLinks()
    return NextResponse.json(links)
  } catch (error) {
    console.error("Error fetching quick links:", error)
    return NextResponse.json({ error: "Failed to fetch quick links" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const link = await request.json()
    const newLink = await addQuickLink(link)
    return NextResponse.json(newLink)
  } catch (error) {
    console.error("Error adding quick link:", error)
    return NextResponse.json({ error: "Failed to add quick link" }, { status: 500 })
  }
}
