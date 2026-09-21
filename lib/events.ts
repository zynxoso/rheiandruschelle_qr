import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { WeddingEvent } from "@/types/database";

export const DEFAULT_EVENT: WeddingEvent = {
  id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
  name: "Rhein & Ruschelle",
  event_code: "rhein-ruschelle-2026",
  event_date: "2026-10-16",
  cover_image: "/images/wedding_invitation.png",
  theme: {
    name: "Spring Pastel Wedding",
    coupleNames: "Rhein & Ruschelle",
    tagline: "Capture a moment from our special day.",
    ceremonyTime: "3:00 PM",
    ceremonyLocation: "Iglesia Ni Cristo Lokal ng Guimba",
    receptionTime: "4:00 PM",
    receptionLocation: "La Herminias Resort",
    colors: {
      background: "#FDFBF7",
      primary: "#E26D5C",
      secondary: "#9B8EB9",
      accent: "#8FA8CF",
      buttercup: "#F3CA68",
      peach: "#F4A261",
      sage: "#8DA38B",
      mint: "#A2C5AC",
      sand: "#E9DECB",
      charcoal: "#242D35",
    },
  },
  is_active: true,
  created_at: new Date().toISOString(),
};

/**
 * Retrieves an event by its unique event_code.
 * If the event is the default Rhein & Ruschelle event and not yet in the DB,
 * automatically attempts to seed it into PostgreSQL.
 */
export async function getEventByCode(eventCode: string): Promise<WeddingEvent | null> {
  const normalizedCode = eventCode.toLowerCase().trim();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("event_code", normalizedCode)
    .single();

  if (!error && data) {
    return data as WeddingEvent;
  }

  // If this is the default event code, ensure it exists in database
  if (normalizedCode === "rhein-ruschelle-2026" || normalizedCode === "default") {
    try {
      const adminClient = createAdminClient();
      const { data: inserted, error: insertError } = await adminClient
        .from("events")
        .upsert(
          {
            id: DEFAULT_EVENT.id,
            name: DEFAULT_EVENT.name,
            event_code: DEFAULT_EVENT.event_code,
            event_date: DEFAULT_EVENT.event_date,
            cover_image: DEFAULT_EVENT.cover_image,
            theme: DEFAULT_EVENT.theme,
            is_active: true,
          },
          { onConflict: "event_code" }
        )
        .select()
        .single();

      if (!insertError && inserted) {
        return inserted as WeddingEvent;
      }
    } catch {
      // Table may not have been created yet, return in-memory default
    }
    return DEFAULT_EVENT;
  }

  return null;
}

/**
 * Retrieves an event by its UUID.
 */
export async function getEventById(eventId: string): Promise<WeddingEvent | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (!error && data) {
    return data as WeddingEvent;
  }

  if (eventId === DEFAULT_EVENT.id) {
    return DEFAULT_EVENT;
  }

  return null;
}
