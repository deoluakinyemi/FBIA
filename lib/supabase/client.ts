"use client"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Create a singleton instance of the Supabase client
let supabaseClient: ReturnType<typeof createSupabaseClient<Database>> | null = null

export function createClientClient() {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  supabaseClient = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
    },
  })

  return supabaseClient
}

// Export createClient as a named export for backward compatibility
export const createClient = createClientClient
