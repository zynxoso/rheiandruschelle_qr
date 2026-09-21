"use client";

import { useEffect } from "react";
import { getOrCreateGuestSession, createClient } from "@/lib/supabase/client";

export function GuestSessionInit({ eventId }: { eventId: string }) {
  useEffect(() => {
    async function initSession() {
      try {
        const guestId = await getOrCreateGuestSession();
        const supabase = createClient();
        // Record anonymous guest visit if table exists
        await supabase.from("guests").insert({
          event_id: eventId,
          anonymous_user_id: guestId,
        });
      } catch {
        // Table or RLS may be restricted or optional
      }
    }
    initSession();
  }, [eventId]);

  return null;
}
