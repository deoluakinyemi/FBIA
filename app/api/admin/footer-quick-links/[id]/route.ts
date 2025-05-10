import { NextResponse } from "next/server"
import { updateQuickLink, deleteQuickLink } from "@/lib/supabase/footer-service"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const link = await request.json()
    const updatedLink = await updateQuickLink({ ...link, id: params.id })
    return NextResponse.json(updatedLink)
  } catch (error) {
    console.error("Error updating quick link:", error)
    return NextResponse.json({ error: "Failed to update quick link" }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    await deleteQuickLink(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting quick link:", error)
    return NextResponse.json({ error: "Failed to delete quick link" }, { status: 500 })
  }
}
