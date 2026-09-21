import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const DEFAULT_SUPABASE_URL = "https://ocyyiceylxrmuezpfkyl.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_uUkIKmAaeqyBRlCyrgr6Vw_3mkBvE0o";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export function createClient() {
  const url = supabaseUrl && supabaseUrl.trim() !== "" ? supabaseUrl : DEFAULT_SUPABASE_URL;
  const key = supabaseAnonKey && supabaseAnonKey.trim() !== "" ? supabaseAnonKey : DEFAULT_SUPABASE_ANON_KEY;

  return createSupabaseClient<Database>(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

/**
 * Returns an anonymous guest ID for the current browser session.
 * First tries Supabase Anonymous Authentication. If anonymous auth is not yet enabled
 * in the Supabase Dashboard, falls back to a persistent local UUID.
 */
export async function getOrCreateGuestSession(): Promise<string> {
  const supabase = createClient();

  if (typeof window === "undefined") {
    return "00000000-0000-0000-0000-000000000000";
  }

  // Check if we already have an active Supabase user session
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData?.session?.user?.id) {
      return sessionData.session.user.id;
    }

    // Try signing in anonymously via Supabase Auth
    const { data: anonData, error: anonError } =
      await supabase.auth.signInAnonymously();
    if (!anonError && anonData?.user?.id) {
      return anonData.user.id;
    }
  } catch {
    // Supabase auth service might have anonymous auth disabled in dashboard settings
  }

  // Fallback: persistent client-side guest UUID stored in localStorage
  const LOCAL_STORAGE_KEY = "wedding_moments_guest_id";
  try {
    const existingLocalId = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (existingLocalId) {
      return existingLocalId;
    }
  } catch {
    // LocalStorage might be restricted
  }

  // Generate a random RFC4122 v4 UUID
  const newGuestId = crypto.randomUUID();
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, newGuestId);
  } catch {
    // LocalStorage might be disabled in private browsing
  }
  return newGuestId;
}

/**
 * Returns the public image URL for a given storage path in the wedding-photos bucket.
 */
export function getPhotoPublicUrl(storagePath: string): string {
  if (!storagePath) return "";
  if (storagePath.startsWith("http://") || storagePath.startsWith("https://")) {
    return storagePath;
  }
  const base = supabaseUrl && supabaseUrl.trim() !== "" ? supabaseUrl : DEFAULT_SUPABASE_URL;
  return `${base}/storage/v1/object/public/wedding-photos/${storagePath}`;
}
