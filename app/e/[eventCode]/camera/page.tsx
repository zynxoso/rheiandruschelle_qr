import React from "react";
import { notFound } from "next/navigation";
import { Camera } from "@/components/Camera";
import { getEventByCode } from "@/lib/events";
import { CameraRedirectWrapper } from "./CameraRedirectWrapper";

interface PageProps {
  params: Promise<{ eventCode: string }>;
}

export default async function CameraPage({ params }: PageProps) {
  const { eventCode } = await params;
  const event = await getEventByCode(eventCode);

  if (!event || !event.is_active) {
    notFound();
  }

  const coupleNames = event.theme?.coupleNames || event.name;

  return (
    <main className="fixed inset-0 h-[100dvh] w-screen overflow-hidden bg-black">
      <CameraRedirectWrapper
        eventId={event.id}
        eventCode={event.event_code}
        coupleNames={coupleNames}
      />
    </main>
  );
}
