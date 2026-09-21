export interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  format: "webp" | "jpeg";
}

export interface CompressOptions {
  maxDimension?: number;
  quality?: number;
}

/**
 * Resizes and converts an image file to WebP (with JPEG fallback) on the client canvas.
 * Reduces raw 8-15MB camera photos down to 150-350KB while preserving high visual fidelity.
 */
export async function compressImage(
  inputFile: File | Blob,
  options: CompressOptions = {}
): Promise<CompressionResult> {
  const maxDimension = options.maxDimension ?? 1600;
  const quality = options.quality ?? 0.8;
  const originalSize = inputFile.size;

  // Create an object URL for the image
  const objectUrl = URL.createObjectURL(inputFile);

  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let targetWidth = img.naturalWidth || img.width;
      let targetHeight = img.naturalHeight || img.height;

      // Calculate scaled dimensions
      if (targetWidth > maxDimension || targetHeight > maxDimension) {
        if (targetWidth > targetHeight) {
          targetHeight = Math.round((targetHeight * maxDimension) / targetWidth);
          targetWidth = maxDimension;
        } else {
          targetWidth = Math.round((targetWidth * maxDimension) / targetHeight);
          targetHeight = maxDimension;
        }
      }

      // Create canvas
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Unable to obtain 2D canvas context"));
        return;
      }

      // High quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Attempt WebP export first
      const exportFormat = "image/webp";
      canvas.toBlob(
        (blob) => {
          if (blob && blob.type === "image/webp") {
            const compressedFile = new File(
              [blob],
              `photo_${Date.now()}.webp`,
              { type: "image/webp" }
            );
            resolve({
              file: compressedFile,
              originalSize,
              compressedSize: compressedFile.size,
              width: targetWidth,
              height: targetHeight,
              format: "webp",
            });
          } else {
            // Fallback to JPEG if WebP is unsupported
            canvas.toBlob(
              (jpegBlob) => {
                if (!jpegBlob) {
                  reject(new Error("Failed to export compressed image"));
                  return;
                }
                const compressedFile = new File(
                  [jpegBlob],
                  `photo_${Date.now()}.jpg`,
                  { type: "image/jpeg" }
                );
                resolve({
                  file: compressedFile,
                  originalSize,
                  compressedSize: compressedFile.size,
                  width: targetWidth,
                  height: targetHeight,
                  format: "jpeg",
                });
              },
              "image/jpeg",
              quality
            );
          }
        },
        exportFormat,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image for compression"));
    };

    img.src = objectUrl;
  });
}
