import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Camera, Image as ImageIcon, Sparkles, Shirt, Calendar, MapPin } from "lucide-react";
import { getEventByCode } from "@/lib/events";
import { FloralFrame } from "@/components/FloralDecoration";
import { GuestSessionInit } from "./GuestSessionInit";

interface PageProps {
  params: Promise<{ eventCode: string }>;
}

export default async function GuestEventLandingPage({ params }: PageProps) {
  const { eventCode } = await params;
  const event = await getEventByCode(eventCode);

  if (!event || !event.is_active) {
    notFound();
  }

  const theme = event.theme;
  const coupleNames = theme?.coupleNames || event.name;
  const formattedDate = new Date(event.event_date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <FloralFrame showCorners={true}>
      {/* Background client component to initialize Supabase anonymous guest session */}
      <GuestSessionInit eventId={event.id} />

      <main className="relative flex min-h-screen flex-col items-center justify-between px-6 py-12 sm:px-8 sm:py-16 text-center">
        {/* Top Tagline & Invitation Lead */}
        <div className="flex flex-col items-center gap-1.5 animate-in fade-in duration-700">
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#7C8793] font-medium">
            Please Join Us For The Wedding Ceremony Of
          </span>
          <div className="w-8 h-px bg-[#E26D5C]/40 mt-1" />
        </div>

        {/* Center: Couple Names & Wedding Details */}
        <div className="flex flex-col items-center my-auto py-8 max-w-lg w-full animate-in zoom-in-95 duration-1000">
          {/* Couple Calligraphy Heading */}
          <div className="flex flex-col items-center">
            <h1 className="font-script text-5xl sm:text-7xl md:text-8xl text-[#E26D5C] tracking-wide drop-shadow-sm select-none">
              {coupleNames.includes("&") ? (
                <>
                  <span>{coupleNames.split("&")[0].trim()}</span>
                  <span className="font-serif italic text-3xl sm:text-4xl text-[#E26D5C]/80 block my-[-8px] sm:my-[-14px]">
                    &
                  </span>
                  <span>{coupleNames.split("&")[1].trim()}</span>
                </>
              ) : (
                coupleNames
              )}
            </h1>
          </div>

          <span className="text-[11px] uppercase tracking-[0.25em] text-[#7C8793] mt-6">
            Which will be held on
          </span>

          {/* Date Stamp with Dividers */}
          <div className="flex items-center justify-center gap-4 my-3 text-[#242D35]">
            <div className="h-px w-8 sm:w-12 bg-[#242D35]" />
            <span className="font-serif text-lg sm:text-2xl tracking-widest uppercase">
              {formattedDate}
            </span>
            <div className="h-px w-8 sm:w-12 bg-[#242D35]" />
          </div>

          {/* Ceremony & Reception Schedule */}
          {(theme?.ceremonyLocation || theme?.receptionLocation) && (
            <div className="flex flex-col items-center gap-1.5 text-xs sm:text-sm text-[#242D35]/80 font-serif mt-2 max-w-sm">
              {theme.ceremonyLocation && (
                <div className="flex items-center gap-1.5 justify-center">
                  <span className="font-semibold text-[#E26D5C]">
                    {theme.ceremonyTime || "3:00 PM"}
                  </span>
                  <span>{theme.ceremonyLocation}</span>
                </div>
              )}
              {theme.receptionLocation && (
                <div className="flex items-center gap-1.5 justify-center">
                  <span className="font-semibold text-[#E26D5C]">
                    {theme.receptionTime || "4:00 PM"}
                  </span>
                  <span>{theme.receptionLocation}</span>
                </div>
              )}
            </div>
          )}

          {/* Wedding Tagline */}
          <p className="font-serif italic text-base sm:text-lg text-[#242D35] mt-6 max-w-xs">
            “{theme?.tagline || "Capture a moment from our special day."}”
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-xs mt-8">
            <Link
              href={`/e/${eventCode}/camera`}
              className="flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-full bg-[#E26D5C] text-white font-semibold text-sm tracking-wider uppercase shadow-lg shadow-[#E26D5C]/35 hover:bg-[#d45d55] active:scale-95 transition"
            >
              <Camera className="h-4 w-4" />
              <span>Take a Photo</span>
            </Link>

            <Link
              href={`/e/${eventCode}/gallery`}
              className="flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-full border border-[#E9DECB] bg-white/80 backdrop-blur-sm text-[#242D35] font-semibold text-sm tracking-wider uppercase hover:bg-white active:scale-95 transition"
            >
              <ImageIcon className="h-4 w-4 text-[#8DA38B]" />
              <span>View Gallery</span>
            </Link>
          </div>
        </div>

        {/* Footer: Attire Guide & Theme Palette */}
        <div className="flex flex-col items-center gap-3 z-10">
          {/* Spring Pastel Palette Swatches */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-[#7C8793] font-sans">
              Theme:
            </span>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#E26D5C]" title="Coral Pink" />
              <span className="h-3 w-3 rounded-full bg-[#9B8EB9]" title="Soft Lavender" />
              <span className="h-3 w-3 rounded-full bg-[#8FA8CF]" title="Powder Blue" />
              <span className="h-3 w-3 rounded-full bg-[#F3CA68]" title="Buttercup Yellow" />
              <span className="h-3 w-3 rounded-full bg-[#8DA38B]" title="Sage Green" />
            </div>
            <span className="text-[11px] text-[#242D35] font-serif italic">
              {theme?.name || "Spring Pastel Wedding"}
            </span>
          </div>

          <div className="text-[11px] text-[#7C8793] tracking-wider uppercase flex items-center gap-1">
            <span>Wedding Moments Live Guest Camera</span>
          </div>
        </div>
      </main>
    </FloralFrame>
  );
}
