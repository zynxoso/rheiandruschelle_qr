"use client";

import React from "react";
import { Camera } from "@/components/Camera";

interface CameraRedirectWrapperProps {
  eventId: string;
  eventCode: string;
  coupleNames: string;
}

/**
 * CameraRedirectWrapper mounts Camera without unmounting or tearing down
 * the MediaStream upon photo uploads, keeping camera permissions persistent.
 */
export function CameraRedirectWrapper({
  eventId,
  eventCode,
  coupleNames,
}: CameraRedirectWrapperProps) {
  return (
    <Camera
      eventId={eventId}
      eventCode={eventCode}
      coupleNames={coupleNames}
    />
  );
}
