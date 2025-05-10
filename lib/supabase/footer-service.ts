import { createClientClient } from "./client"
import { createServerClient } from "./server"

export type FooterSettings = {
  id: string
  address: string
  phone: string
  email: string
  facebook_url: string
  twitter_url: string
  instagram_url: string
  linkedin_url: string
  copyright_text: string
  newsletter_enabled: boolean
  newsletter_text: string
}

export type QuickLink = {
  id: string
  title: string
  url: string
  display_order: number
}

// Get footer settings
export async function getFooterSettings() {
  const supabase = createClientClient()
  const { data, error } = await supabase.from("footer_settings").select("*").single()

  if (error) {
    console.error("Error fetching footer settings:", error)
    return null
  }

  return data
}

// Get quick links
export async function getQuickLinks() {
  const supabase = createClientClient()
  const { data, error } = await supabase
    .from("footer_quick_links")
    .select("*")
    .order("display_order", { ascending: true })

  if (error) {
    console.error("Error fetching quick links:", error)
    return []
  }

  return data
}

// Admin functions

// Update footer settings
export async function updateFooterSettings(settings: Partial<FooterSettings>) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from("footer_settings")
    .update({
      ...settings,
      updated_at: new Date().toISOString(),
    })
    .eq("id", settings.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating footer settings:", error)
    throw error
  }

  return data
}

// Add quick link
export async function addQuickLink(link: Omit<QuickLink, "id" | "created_at" | "updated_at">) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from("footer_quick_links")
    .insert({
      ...link,
    })
    .select()
    .single()

  if (error) {
    console.error("Error adding quick link:", error)
    throw error
  }

  return data
}

// Update quick link
export async function updateQuickLink(link: Partial<QuickLink> & { id: string }) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from("footer_quick_links")
    .update({
      ...link,
      updated_at: new Date().toISOString(),
    })
    .eq("id", link.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating quick link:", error)
    throw error
  }

  return data
}

// Delete quick link
export async function deleteQuickLink(id: string) {
  const supabase = createServerClient()
  const { error } = await supabase.from("footer_quick_links").delete().eq("id", id)

  if (error) {
    console.error("Error deleting quick link:", error)
    throw error
  }

  return { success: true }
}
