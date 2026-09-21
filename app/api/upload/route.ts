import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const eventId = formData.get("eventId") as string | null;
    const guestId = formData.get("guestId") as string | null;
    const caption = formData.get("caption") as string | null;

    if (!file || !eventId) {
      return NextResponse.json(
        { error: "Missing required file or eventId" },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();
    const photoId = crypto.randomUUID();
    const storagePath = `${eventId}/${photoId}.webp`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Upload to Supabase Storage using admin client
    const { error: storageError } = await adminClient.storage
      .from("wedding-photos")
      .upload(storagePath, buffer, {
        contentType: file.type || "image/webp",
        cacheControl: "3600",
        upsert: true,
      });

    if (storageError) {
      return NextResponse.json(
        { error: `Storage upload error: ${storageError.message}` },
        { status: 500 }
      );
    }

    // 2. Insert into PostgreSQL photos table
    const { error: dbError } = await adminClient.from("photos").insert({
      id: photoId,
      event_id: eventId,
      guest_id: guestId || null,
      storage_path: storagePath,
      caption: caption || null,
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      return NextResponse.json(
        {
          error: `Database insert error: ${dbError.message}. Ensure supabase/schema.sql has been run in your Supabase SQL Editor.`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, photoId, storagePath });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Upload processing failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
