import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://ocyyiceylxrmuezpfkyl.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_uUkIKmAaeqyBRlCyrgr6Vw_3mkBvE0o";

/**
 * Server-side client for fetching public wedding data in Server Components.
 * Uses direct Supabase client to avoid cookie dynamic prerender bailouts.
 */
export async function createClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
