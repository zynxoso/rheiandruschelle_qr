import React from "react";
import Link from "next/link";
import { Camera, Image as ImageIcon, QrCode } from "lucide-react";

interface WeddingHeaderProps {
  eventCode?: string;
  coupleNames?: string;
  weddingDate?: string;
  activeTab?: "invitation" | "camera" | "gallery" | "qr";
  showNav?: boolean;
}

export function WeddingHeader({
  eventCode = "rhein-ruschelle-2026",
  coupleNames = "Rhein & Ruschelle",
  weddingDate = "October 16, 2026",
  activeTab = "invitation",
  showNav = true,
}: WeddingHeaderProps) {
  return (
    <header className="relative w-full border-b border-[#E9DECB]/60 bg-[#FDFBF7]/90 backdrop-blur-md px-4 py-3 sm:px-6 transition-all">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        {/* Brand / Couple Name */}
        <Link
          href={`/e/${eventCode}`}
          className="group flex flex-col transition hover:opacity-85"
        >
          <span className="font-serif text-xl sm:text-2xl tracking-wide text-[#242D35] group-hover:text-[#E26D5C] transition-colors">
            {coupleNames}
          </span>
          <span className="text-[11px] uppercase tracking-widest text-[#7C8793]">
            {weddingDate}
          </span>
        </Link>

        {/* Action Navigation */}
        {showNav && (
          <nav className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href={`/e/${eventCode}/camera`}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                activeTab === "camera"
                  ? "bg-[#E26D5C] text-white shadow-sm shadow-[#E26D5C]/30"
                  : "bg-[#F3EFE6] text-[#242D35] hover:bg-[#EAE4D7]"
              }`}
            >
              <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline sm:inline">Camera</span>
            </Link>

            <Link
              href={`/e/${eventCode}/gallery`}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                activeTab === "gallery"
                  ? "bg-[#E26D5C] text-white shadow-sm shadow-[#E26D5C]/30"
                  : "bg-[#F3EFE6] text-[#242D35] hover:bg-[#EAE4D7]"
              }`}
            >
              <ImageIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline sm:inline">Live Gallery</span>
            </Link>

            <Link
              href={`/e/${eventCode}`}
              className={`flex items-center gap-1.5 rounded-full p-2 text-xs sm:text-sm font-medium transition-all ${
                activeTab === "invitation"
                  ? "bg-[#8DA38B] text-white"
                  : "bg-[#F3EFE6] text-[#242D35] hover:bg-[#EAE4D7]"
              }`}
              title="View Wedding Invitation"
            >
              <QrCode className="h-4 w-4" />
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
