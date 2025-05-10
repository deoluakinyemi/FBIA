"use client"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Create a singleton instance of the Supabase client
let supabaseClient: ReturnType<typeof createSupabaseClient<Database>> | null = null

// Original function name for backward compatibility
export function createClient() {
  return createClientClient()
}

// New function name
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
