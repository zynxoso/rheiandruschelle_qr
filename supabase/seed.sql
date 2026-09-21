-- ==========================================================
-- WEDDING MOMENTS: Sample Event Seed Data
-- ==========================================================

INSERT INTO public.events (
  id,
  name,
  event_code,
  event_date,
  cover_image,
  theme,
  is_active
)
VALUES (
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  'Rhein & Ruschelle',
  'rhein-ruschelle-2026',
  '2026-10-16',
  '/images/wedding_invitation.png',
  '{
    "name": "Spring Pastel Wedding",
    "coupleNames": "Rhein & Ruschelle",
    "tagline": "Capture a moment from our special day.",
    "ceremonyTime": "3:00 PM",
    "ceremonyLocation": "Iglesia Ni Cristo Lokal ng Guimba",
    "receptionTime": "4:00 PM",
    "receptionLocation": "La Herminias Resort",
    "colors": {
      "background": "#FDFBF7",
      "primary": "#E26D5C",
      "secondary": "#9B8EB9",
      "accent": "#8FA8CF",
      "buttercup": "#F3CA68",
      "peach": "#F4A261",
      "sage": "#8DA38B",
      "mint": "#A2C5AC",
      "sand": "#E9DECB",
      "charcoal": "#242D35"
    }
  }'::jsonb,
  true
)
ON CONFLICT (event_code) DO UPDATE SET
  name = EXCLUDED.name,
  event_date = EXCLUDED.event_date,
  cover_image = EXCLUDED.cover_image,
  theme = EXCLUDED.theme,
  is_active = true;
