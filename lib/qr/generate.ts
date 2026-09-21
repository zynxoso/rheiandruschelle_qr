import QRCode from "qrcode";

export interface QRCodeOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

/**
 * Generates a high-resolution PNG data URL for a given event code or URL.
 */
export async function generateQRCodeDataUrl(
  text: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const defaultOptions: QRCode.QRCodeToDataURLOptions = {
    width: options.width ?? 600,
    margin: options.margin ?? 2,
    color: {
      dark: options.color?.dark ?? "#242D35",
      light: options.color?.light ?? "#FFFFFF",
    },
    errorCorrectionLevel: "H",
  };

  return QRCode.toDataURL(text, defaultOptions);
}

/**
 * Returns the full guest landing page URL for a given event code.
 */
export function getEventGuestUrl(eventCode: string, origin?: string): string {
  const base =
    origin ||
    (typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "https://weddingmoments.vercel.app");

  return `${base}/e/${eventCode}`;
}
