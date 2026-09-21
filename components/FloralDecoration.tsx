import React from "react";

interface FloralDecorationProps {
  className?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";
  size?: "sm" | "md" | "lg" | "xl";
}

/**
 * Watercolor-style botanical wildflowers matching Rhein & Ruschelle's Spring Pastel wedding invitation.
 * Features soft lavender bellflowers, light blue forget-me-nots, coral pink blossoms, buttercup petals, and sage foliage.
 */
export function FloralDecoration({
  className = "",
  position = "top-left",
  size = "md",
}: FloralDecorationProps) {
  const sizeClasses = {
    sm: "w-24 h-24 sm:w-32 sm:h-32",
    md: "w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56",
    lg: "w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80",
    xl: "w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96",
  };

  const transformClass = {
    "top-left": "",
    "top-right": "scale-x-[-1]",
    "bottom-left": "scale-y-[-1]",
    "bottom-right": "scale-x-[-1] scale-y-[-1]",
    "top-center": "rotate-90",
    "bottom-center": "-rotate-90",
  }[position];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none ${sizeClasses[size]} ${transformClass} ${className}`}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full opacity-90 transition-opacity duration-700"
      >
        <defs>
          <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Delicate leafy sprigs & stems */}
        <path
          d="M10,190 C30,140 50,80 120,40"
          stroke="#8DA38B"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M20,195 C45,160 80,130 150,90"
          stroke="#A2C5AC"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M5,160 C25,120 70,80 100,20"
          stroke="#7A9478"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Small leaves along stem */}
        <path
          d="M55,105 C62,95 72,98 68,110 C64,115 57,112 55,105 Z"
          fill="#8DA38B"
          opacity="0.8"
        />
        <path
          d="M85,75 C95,68 102,74 97,84 C92,89 86,84 85,75 Z"
          fill="#A2C5AC"
          opacity="0.7"
        />
        <path
          d="M38,140 C42,130 52,132 48,142 C44,148 39,145 38,140 Z"
          fill="#8DA38B"
          opacity="0.75"
        />
        <path
          d="M70,135 C80,130 85,138 78,145 C73,148 68,143 70,135 Z"
          fill="#A2C5AC"
          opacity="0.65"
        />

        {/* Lavender Bellflower 1 (Top branch) */}
        <g transform="translate(115, 30) rotate(-15)" filter="url(#soft-glow)">
          <path
            d="M0,15 C-12,5 -8,-10 0,-15 C8,-10 12,5 0,15 Z"
            fill="#9B8EB9"
            opacity="0.88"
          />
          <path
            d="M-6,10 C-16,0 -12,-8 -4,-12"
            fill="#B4A8D0"
            opacity="0.7"
          />
          <path
            d="M6,10 C16,0 12,-8 4,-12"
            fill="#8A7CA8"
            opacity="0.75"
          />
          <circle cx="0" cy="-2" r="2" fill="#F3CA68" />
        </g>

        {/* Powder Blue Forget-me-not flower cluster */}
        <g transform="translate(45, 80)" filter="url(#soft-glow)">
          <circle cx="-5" cy="-5" r="4.5" fill="#8FA8CF" opacity="0.9" />
          <circle cx="5" cy="-5" r="4.5" fill="#8FA8CF" opacity="0.9" />
          <circle cx="6" cy="5" r="4.5" fill="#7DA0C7" opacity="0.9" />
          <circle cx="-5" cy="5" r="4.5" fill="#7DA0C7" opacity="0.9" />
          <circle cx="0" cy="-7" r="4.2" fill="#9FB5D6" opacity="0.85" />
          <circle cx="0" cy="0" r="2.2" fill="#F3CA68" />
        </g>

        {/* Second Forget-me-not (smaller, lower) */}
        <g transform="translate(75, 120)" filter="url(#soft-glow)">
          <circle cx="-4" cy="-4" r="3.5" fill="#8FA8CF" opacity="0.85" />
          <circle cx="4" cy="-4" r="3.5" fill="#8FA8CF" opacity="0.85" />
          <circle cx="5" cy="4" r="3.5" fill="#7DA0C7" opacity="0.85" />
          <circle cx="-4" cy="4" r="3.5" fill="#7DA0C7" opacity="0.85" />
          <circle cx="0" cy="0" r="1.8" fill="#F3CA68" />
        </g>

        {/* Coral Pink Poppy / Wild Rose (Center visual anchor) */}
        <g transform="translate(95, 85)" filter="url(#soft-glow)">
          <path
            d="M0,0 C-15,-20 0,-30 12,-18 C22,-5 12,10 0,0 Z"
            fill="#E26D5C"
            opacity="0.85"
          />
          <path
            d="M0,0 C15,-18 28,-5 18,12 C8,22 -5,12 0,0 Z"
            fill="#EA8172"
            opacity="0.8"
          />
          <path
            d="M0,0 C-18,-5 -22,12 -8,18 C5,22 8,8 0,0 Z"
            fill="#D95D4B"
            opacity="0.82"
          />
          <path
            d="M0,0 C-12,-15 -25,-2 -15,10 Z"
            fill="#F4A261"
            opacity="0.75"
          />
          <circle cx="1" cy="0" r="3" fill="#F3CA68" />
          <circle cx="1" cy="0" r="1.5" fill="#D45D55" />
        </g>

        {/* Buttercup Yellow Wildflower (Top edge) */}
        <g transform="translate(145, 85)" filter="url(#soft-glow)">
          <ellipse cx="0" cy="-6" rx="3.5" ry="5.5" fill="#F3CA68" opacity="0.9" />
          <ellipse cx="6" cy="-2" rx="3.5" ry="5.5" fill="#F5D37E" opacity="0.85" transform="rotate(60 6 -2)" />
          <ellipse cx="4" cy="5" rx="3.5" ry="5.5" fill="#F0C152" opacity="0.9" transform="rotate(120 4 5)" />
          <ellipse cx="-4" cy="5" rx="3.5" ry="5.5" fill="#F3CA68" opacity="0.85" transform="rotate(-120 -4 5)" />
          <ellipse cx="-6" cy="-2" rx="3.5" ry="5.5" fill="#F5D37E" opacity="0.9" transform="rotate(-60 -6 -2)" />
          <circle cx="0" cy="1" r="2.5" fill="#E26D5C" opacity="0.8" />
        </g>

        {/* Soft Lavender Blossom (Lower left) */}
        <g transform="translate(30, 160)" filter="url(#soft-glow)">
          <path
            d="M0,0 C-10,-12 5,-18 10,-8 C14,2 6,8 0,0 Z"
            fill="#A89BC4"
            opacity="0.85"
          />
          <path
            d="M0,0 C8,-14 18,-4 12,6 C6,14 -4,8 0,0 Z"
            fill="#9B8EB9"
            opacity="0.8"
          />
          <circle cx="4" cy="-2" r="1.8" fill="#F3CA68" />
        </g>

        {/* Floating delicate petal accents */}
        <ellipse cx="160" cy="40" rx="3.5" ry="2" fill="#EA8172" opacity="0.6" transform="rotate(25)" />
        <ellipse cx="110" cy="140" rx="3" ry="1.8" fill="#8FA8CF" opacity="0.65" transform="rotate(-35)" />
        <ellipse cx="60" cy="45" rx="2.5" ry="1.5" fill="#F3CA68" opacity="0.7" transform="rotate(40)" />
      </svg>
    </div>
  );
}

/**
 * Full-page botanical border frame container that frames wedding pages elegantly
 * just like the physical invitation card.
 */
export function FloralFrame({
  children,
  className = "",
  showCorners = true,
}: {
  children: React.ReactNode;
  className?: string;
  showCorners?: boolean;
}) {
  return (
    <div className={`relative min-h-screen w-full overflow-hidden bg-[#FDFBF7] text-[#242D35] ${className}`}>
      {showCorners && (
        <>
          {/* Top Left Wildflower Cluster */}
          <div className="absolute top-0 left-0 z-0">
            <FloralDecoration position="top-left" size="lg" />
          </div>

          {/* Top Right Wildflower Cluster */}
          <div className="absolute top-0 right-0 z-0">
            <FloralDecoration position="top-right" size="lg" />
          </div>

          {/* Bottom Left Wildflower Cluster */}
          <div className="absolute bottom-0 left-0 z-0">
            <FloralDecoration position="bottom-left" size="lg" />
          </div>

          {/* Bottom Right Wildflower Cluster */}
          <div className="absolute bottom-0 right-0 z-0">
            <FloralDecoration position="bottom-right" size="lg" />
          </div>
        </>
      )}

      {/* Content Layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
