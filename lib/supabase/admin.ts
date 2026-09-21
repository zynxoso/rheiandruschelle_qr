import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const DEFAULT_SUPABASE_URL = "https://ocyyiceylxrmuezpfkyl.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_uUkIKmAaeqyBRlCyrgr6Vw_3mkBvE0o";

/**
 * Service-role admin client for server-side trusted operations.
 * Always resolves to a valid URL and Key so it never throws on initialization.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    DEFAULT_SUPABASE_ANON_KEY;

  const validUrl = url && url.trim() !== "" ? url : DEFAULT_SUPABASE_URL;
  const validKey = key && key.trim() !== "" ? key : DEFAULT_SUPABASE_ANON_KEY;

  return createSupabaseClient<Database>(validUrl, validKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
