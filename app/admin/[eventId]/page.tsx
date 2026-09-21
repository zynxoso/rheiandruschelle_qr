import React from "react";
import { notFound } from "next/navigation";
import { getEventById } from "@/lib/events";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminDashboardClient } from "./AdminDashboardClient";
import type { Photo } from "@/types/database";

interface PageProps {
  params: Promise<{ eventId: string }>;
}

export default async function AdminDashboardPage({ params }: PageProps) {
  const { eventId } = await params;
  const event = await getEventById(eventId);

  if (!event) {
    notFound();
  }

  // Fetch photos including soft-deleted ones for moderation overview
  const adminClient = createAdminClient();
  const { data: photos } = await adminClient
    .from("photos")
    .select("*")
    .eq("event_id", event.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#242D35] pb-24">
      <AdminDashboardClient
        initialEvent={event}
        initialPhotos={(photos as Photo[]) || []}
      />
    </main>
  );
}
