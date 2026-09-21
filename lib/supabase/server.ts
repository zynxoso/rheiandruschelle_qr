import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const DEFAULT_SUPABASE_URL = "https://ocyyiceylxrmuezpfkyl.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_uUkIKmAaeqyBRlCyrgr6Vw_3mkBvE0o";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

/**
 * Server-side client for fetching public wedding data in Server Components.
 * Always resolves to a valid URL and Key to prevent server render crashes.
 */
export async function createClient() {
  const url = supabaseUrl && supabaseUrl.trim() !== "" ? supabaseUrl : DEFAULT_SUPABASE_URL;
  const key = supabaseAnonKey && supabaseAnonKey.trim() !== "" ? supabaseAnonKey : DEFAULT_SUPABASE_ANON_KEY;

  return createSupabaseClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
