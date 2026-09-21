import React from "react";
import { notFound } from "next/navigation";
import { getEventByCode } from "@/lib/events";
import { WeddingHeader } from "@/components/WeddingHeader";
import { Gallery } from "@/components/Gallery";
import { FloralFrame } from "@/components/FloralDecoration";
import { createClient } from "@/lib/supabase/server";
import type { Photo } from "@/types/database";

interface PageProps {
  params: Promise<{ eventCode: string }>;
}

export default async function LiveGalleryPage({ params }: PageProps) {
  const { eventCode } = await params;
  const event = await getEventByCode(eventCode);

  if (!event || !event.is_active) {
    notFound();
  }

  const coupleNames = event.theme?.coupleNames || event.name;
  const formattedDate = new Date(event.event_date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Fetch initial photos on server side for fast first paint
  const supabase = await createClient();
  const { data: initialPhotos } = await supabase
    .from("photos")
    .select("*")
    .eq("event_id", event.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  return (
    <FloralFrame showCorners={true}>
      <WeddingHeader
        eventCode={event.event_code}
        coupleNames={coupleNames}
        weddingDate={formattedDate}
        activeTab="gallery"
      />

      <main className="min-h-[calc(100vh-65px)] pb-16">
        <Gallery
          eventId={event.id}
          eventCode={event.event_code}
          coupleNames={coupleNames}
          initialPhotos={(initialPhotos as Photo[]) || []}
        />
      </main>
    </FloralFrame>
  );
}
