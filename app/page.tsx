import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Camera,
  Image as ImageIcon,
  QrCode,
  Sparkles,
  Heart,
  ShieldCheck,
  Zap,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { FloralFrame } from "@/components/FloralDecoration";

export default function HomePage() {
  return (
    <FloralFrame showCorners={true}>
      <div className="min-h-screen flex flex-col justify-between px-4 sm:px-6 py-10 sm:py-16 max-w-5xl mx-auto">
        {/* Hero Section */}
        <header className="flex flex-col items-center text-center max-w-2xl mx-auto pt-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E9DECB] bg-white/80 px-4 py-1.5 text-xs text-[#7C8793] font-medium backdrop-blur-md mb-6">
            <Sparkles className="h-3.5 w-3.5 text-[#E26D5C]" />
            <span>QR-Based Live Wedding Camera & Shared Gallery</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl text-[#242D35] tracking-tight leading-tight">
            Capture & Share Wedding Moments in Real Time
          </h1>

          <p className="font-serif italic text-base sm:text-lg text-[#7C8793] mt-4 max-w-lg leading-relaxed">
            Guests simply scan a table QR code on their phones, snap photos with their camera, and watch all guest memories blossom together in a shared live gallery.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Link
              href="/e/rhein-ruschelle-2026"
              className="flex items-center gap-2 rounded-full bg-[#E26D5C] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#E26D5C]/35 hover:bg-[#d45d55] active:scale-95 transition"
            >
              <span>Experience Demo Event</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/create"
              className="flex items-center gap-2 rounded-full border border-[#E9DECB] bg-white px-6 py-3.5 text-sm font-semibold text-[#242D35] hover:bg-[#FDFBF7] active:scale-95 transition"
            >
              <span>Create Wedding Event</span>
            </Link>
          </div>
        </header>

        {/* Featured Wedding Showcase Card */}
        <section className="my-12">
          <div className="rounded-3xl bg-white/85 backdrop-blur-md border border-[#E9DECB] p-6 sm:p-10 shadow-xl max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-[#E9DECB]/60">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#E26D5C] font-semibold">
                  Featured Celebration
                </span>
                <h2 className="font-script text-4xl sm:text-5xl text-[#242D35] mt-1">
                  Rhein & Ruschelle
                </h2>
                <p className="font-serif text-xs sm:text-sm text-[#7C8793] mt-1">
                  October 16, 2026 • Spring Pastel Wedding
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/admin/a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"
                  className="rounded-full border border-[#E9DECB] bg-[#FDFBF7] px-3.5 py-2 text-xs font-medium text-[#242D35] hover:bg-white transition"
                >
                  Admin Dashboard
                </Link>
              </div>
            </div>

            {/* Event Quick Access Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6">
              <Link
                href="/e/rhein-ruschelle-2026"
                className="group flex flex-col p-4 rounded-2xl bg-[#FDFBF7] border border-[#E9DECB]/80 hover:border-[#E26D5C]/50 hover:shadow-md transition"
              >
                <div className="h-9 w-9 rounded-xl bg-[#E26D5C]/15 flex items-center justify-center text-[#E26D5C] mb-3">
                  <QrCode className="h-5 w-5" />
                </div>
                <span className="font-serif text-base text-[#242D35] group-hover:text-[#E26D5C] transition-colors">
                  Guest Invitation
                </span>
                <span className="text-xs text-[#7C8793] mt-1">
                  Digital invitation page scanned from table QR cards.
                </span>
              </Link>

              <Link
                href="/e/rhein-ruschelle-2026/camera"
                className="group flex flex-col p-4 rounded-2xl bg-[#FDFBF7] border border-[#E9DECB]/80 hover:border-[#E26D5C]/50 hover:shadow-md transition"
              >
                <div className="h-9 w-9 rounded-xl bg-[#8DA38B]/15 flex items-center justify-center text-[#8DA38B] mb-3">
                  <Camera className="h-5 w-5" />
                </div>
                <span className="font-serif text-base text-[#242D35] group-hover:text-[#8DA38B] transition-colors">
                  Guest Camera
                </span>
                <span className="text-xs text-[#7C8793] mt-1">
                  Instant mobile capture with client-side WebP compression.
                </span>
              </Link>

              <Link
                href="/e/rhein-ruschelle-2026/gallery"
                className="group flex flex-col p-4 rounded-2xl bg-[#FDFBF7] border border-[#E9DECB]/80 hover:border-[#E26D5C]/50 hover:shadow-md transition"
              >
                <div className="h-9 w-9 rounded-xl bg-[#9B8EB9]/15 flex items-center justify-center text-[#9B8EB9] mb-3">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <span className="font-serif text-base text-[#242D35] group-hover:text-[#9B8EB9] transition-colors">
                  Live Gallery
                </span>
                <span className="text-xs text-[#7C8793] mt-1">
                  Real-time shared gallery synced with Supabase Realtime.
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Highlights Footer */}
        <footer className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#E9DECB]/60 text-center text-[#7C8793]">
          <div className="flex flex-col items-center gap-1">
            <Zap className="h-4 w-4 text-[#E26D5C]" />
            <span className="text-xs font-semibold text-[#242D35]">Zero Sign-Up</span>
            <span className="text-[11px]">Instant anonymous guest sessions</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Sparkles className="h-4 w-4 text-[#8DA38B]" />
            <span className="text-xs font-semibold text-[#242D35]">Supabase Realtime</span>
            <span className="text-[11px]">Photos appear live with no refresh</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-[#8FA8CF]" />
            <span className="text-xs font-semibold text-[#242D35]">Optimized WebP</span>
            <span className="text-[11px]">Client compression saves storage</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Heart className="h-4 w-4 text-[#9B8EB9]" />
            <span className="text-xs font-semibold text-[#242D35]">Spring Pastel Theme</span>
            <span className="text-[11px]">Watercolor floral invitation design</span>
          </div>
        </footer>
      </div>
    </FloralFrame>
  );
}
