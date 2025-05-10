import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/database.types"

// Create a Supabase client for server components
export const createServerClient = () => {
  return createServerComponentClient<Database>({ cookies })
}
