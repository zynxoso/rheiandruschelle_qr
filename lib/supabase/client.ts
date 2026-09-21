import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ocyyiceylxrmuezpfkyl.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export function createClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
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
    const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
    if (!anonError && anonData?.user?.id) {
      return anonData.user.id;
    }
  } catch {
    // Supabase auth service might have anonymous auth disabled in dashboard settings
  }

  // Fallback: persistent client-side guest UUID stored in localStorage
  const LOCAL_STORAGE_KEY = "wedding_moments_guest_id";
  const existingLocalId = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (existingLocalId) {
    return existingLocalId;
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
  return `${supabaseUrl}/storage/v1/object/public/wedding-photos/${storagePath}`;
}
