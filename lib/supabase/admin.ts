import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://ocyyiceylxrmuezpfkyl.supabase.co";

// Fallback to anon key if service role key is not yet set in environment
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_uUkIKmAaeqyBRlCyrgr6Vw_3mkBvE0o";

/**
 * Service-role admin client for server-side trusted operations.
 * DO NOT expose to client components.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
