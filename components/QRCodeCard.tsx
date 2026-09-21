"use client";

import React, { useEffect, useState, useRef } from "react";
import { Download, Copy, Check, Printer, Share2 } from "lucide-react";
import { generateQRCodeDataUrl, getEventGuestUrl } from "@/lib/qr/generate";
import { FloralDecoration } from "@/components/FloralDecoration";

interface QRCodeCardProps {
  eventCode: string;
  coupleNames?: string;
  weddingDate?: string;
  themeName?: string;
}

export function QRCodeCard({
  eventCode,
  coupleNames = "Rhein & Ruschelle",
  weddingDate = "October 16, 2026",
  themeName = "Spring Pastel Wedding",
}: QRCodeCardProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const guestUrl = getEventGuestUrl(eventCode);

  useEffect(() => {
    generateQRCodeDataUrl(guestUrl, {
      width: 800,
      margin: 1,
      color: { dark: "#242D35", light: "#FFFFFF" },
    }).then(setQrDataUrl);
  }, [guestUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(guestUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownloadPNG = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `wedding_qr_${eventCode}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      {/* Printable Card */}
      <div
        ref={cardRef}
        id="printable-qr-card"
        className="relative w-full overflow-hidden rounded-3xl bg-[#FDFBF7] p-8 border-2 border-[#E9DECB] shadow-xl text-center"
      >
        {/* Subtle Watercolor Floral Corner Sprigs */}
        <div className="absolute -top-4 -left-4 pointer-events-none">
          <FloralDecoration position="top-left" size="sm" />
        </div>
        <div className="absolute -top-4 -right-4 pointer-events-none">
          <FloralDecoration position="top-right" size="sm" />
        </div>
        <div className="absolute -bottom-4 -left-4 pointer-events-none">
          <FloralDecoration position="bottom-left" size="sm" />
        </div>
        <div className="absolute -bottom-4 -right-4 pointer-events-none">
          <FloralDecoration position="bottom-right" size="sm" />
        </div>

        {/* Card Content */}
        <div className="relative z-10 flex flex-col items-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#7C8793] font-sans font-medium">
            Wedding Moments
          </p>

          <h2 className="font-serif text-3xl sm:text-4xl text-[#E26D5C] tracking-wide mt-2">
            {coupleNames}
          </h2>

          <div className="w-12 h-0.5 bg-[#E9DECB] my-3" />

          <p className="font-serif italic text-sm sm:text-base text-[#242D35] max-w-xs leading-snug">
            Scan to capture and share your memories with us
          </p>

          {/* QR Code Container */}
          <div className="my-6 rounded-2xl bg-white p-4 shadow-md border border-[#E9DECB]/80">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt={`QR code for ${coupleNames} wedding`}
                className="h-52 w-52 sm:h-60 sm:w-60 object-contain rounded-lg"
              />
            ) : (
              <div className="h-52 w-52 sm:h-60 sm:w-60 bg-[#F3EFE6] animate-pulse rounded-lg" />
            )}
          </div>

          <p className="text-[11px] uppercase tracking-[0.2em] text-[#242D35] font-semibold">
            {themeName}
          </p>

          <p className="font-serif text-xs text-[#7C8793] mt-1 tracking-wider">
            {weddingDate}
          </p>
        </div>
      </div>

      {/* Action Buttons for Admin & Hosts */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 w-full">
        <button
          type="button"
          onClick={handleDownloadPNG}
          disabled={!qrDataUrl}
          className="flex items-center gap-2 rounded-full bg-[#E26D5C] px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#E26D5C]/30 hover:bg-[#d45d55] active:scale-95 transition"
        >
          <Download className="h-4 w-4" />
          <span>Download PNG</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-2 rounded-full border border-[#E9DECB] bg-white px-4 py-2.5 text-xs font-semibold text-[#242D35] hover:bg-[#FDFBF7] active:scale-95 transition"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-[#8DA38B]" />
              <span className="text-[#8DA38B]">URL Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 text-[#7C8793]" />
              <span>Copy Link</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-full border border-[#E9DECB] bg-white px-4 py-2.5 text-xs font-semibold text-[#242D35] hover:bg-[#FDFBF7] active:scale-95 transition"
        >
          <Printer className="h-4 w-4 text-[#7C8793]" />
          <span>Print Table Card</span>
        </button>
      </div>
    </div>
  );
}
