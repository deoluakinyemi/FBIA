"use client"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Create a singleton instance of the Supabase client
let supabaseClient: ReturnType<typeof createSupabaseClient<Database>> | null = null

// This function is ONLY for client components
export function createClientClient() {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables")
  }

  supabaseClient = createSupabaseClient<Database>(supabaseUrl, supabaseKey)
  return supabaseClient
}

// For backward compatibility - but should only be used in client components
export function createClient() {
  return createClientClient()
}
