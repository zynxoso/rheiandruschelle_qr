-- ==========================================================
-- WEDDING MOMENTS: Supabase PostgreSQL Schema & Security Policies
-- ==========================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create tables
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  event_code TEXT UNIQUE NOT NULL,
  event_date DATE NOT NULL,
  cover_image TEXT,
  theme JSONB DEFAULT '{
    "name": "Spring Pastel",
    "primary": "#E26D5C",
    "secondary": "#9B8EB9",
    "accent": "#8FA8CF",
    "background": "#FDFBF7"
  }'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  guest_id UUID,
  storage_path TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  anonymous_user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_code ON public.events(event_code);
CREATE INDEX IF NOT EXISTS idx_photos_event_created ON public.photos(event_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_photos_deleted ON public.photos(deleted_at);
CREATE INDEX IF NOT EXISTS idx_guests_event ON public.guests(event_id, anonymous_user_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for events
DROP POLICY IF EXISTS "Public can view active events" ON public.events;
CREATE POLICY "Public can view active events"
  ON public.events FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Allow event creation" ON public.events;
CREATE POLICY "Allow event creation"
  ON public.events FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow event modification" ON public.events;
CREATE POLICY "Allow event modification"
  ON public.events FOR UPDATE
  USING (true);

-- 6. RLS Policies for photos
DROP POLICY IF EXISTS "Guests can view non-deleted photos of active events" ON public.photos;
CREATE POLICY "Guests can view non-deleted photos of active events"
  ON public.photos FOR SELECT
  USING (
    deleted_at IS NULL
    AND EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = photos.event_id AND events.is_active = true
    )
  );

DROP POLICY IF EXISTS "Guests can upload photos to active events" ON public.photos;
CREATE POLICY "Guests can upload photos to active events"
  ON public.photos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = photos.event_id AND events.is_active = true
    )
  );

DROP POLICY IF EXISTS "Admin and creators can update photos (soft-delete)" ON public.photos;
CREATE POLICY "Admin and creators can update photos (soft-delete)"
  ON public.photos FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Admin can delete photos" ON public.photos;
CREATE POLICY "Admin can delete photos"
  ON public.photos FOR DELETE
  USING (true);

-- 7. RLS Policies for guests
DROP POLICY IF EXISTS "Allow guest registration" ON public.guests;
CREATE POLICY "Allow guest registration"
  ON public.guests FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow guest selection" ON public.guests;
CREATE POLICY "Allow guest selection"
  ON public.guests FOR SELECT
  USING (true);

-- 8. Storage bucket setup
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'wedding-photos',
  'wedding-photos',
  true,
  10485760,
  ARRAY['image/webp', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/webp', 'image/jpeg', 'image/png'];

-- 9. Storage Object Policies
DROP POLICY IF EXISTS "Public can view wedding photos" ON storage.objects;
CREATE POLICY "Public can view wedding photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'wedding-photos');

DROP POLICY IF EXISTS "Public and guests can upload photos" ON storage.objects;
CREATE POLICY "Public and guests can upload photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'wedding-photos');

DROP POLICY IF EXISTS "Admins can delete storage objects" ON storage.objects;
CREATE POLICY "Admins can delete storage objects"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'wedding-photos');

-- 10. Enable Supabase Realtime on photos
ALTER TABLE public.photos REPLICA IDENTITY FULL;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'photos'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.photos;
  END IF;
END $$;
