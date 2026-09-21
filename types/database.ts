export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type WeddingThemeColors = {
  background: string;
  primary: string;
  secondary: string;
  accent: string;
  buttercup?: string;
  peach?: string;
  sage?: string;
  mint?: string;
  sand?: string;
  charcoal?: string;
  [key: string]: unknown;
};

export type WeddingTheme = {
  name: string;
  coupleNames?: string;
  tagline?: string;
  ceremonyTime?: string;
  ceremonyLocation?: string;
  receptionTime?: string;
  receptionLocation?: string;
  colors: WeddingThemeColors;
  [key: string]: unknown;
};

export type WeddingEvent = {
  id: string;
  name: string;
  event_code: string;
  event_date: string;
  cover_image: string | null;
  theme: WeddingTheme | null;
  is_active: boolean;
  created_at: string;
  [key: string]: unknown;
};

export type Photo = {
  id: string;
  event_id: string;
  guest_id: string | null;
  storage_path: string;
  caption?: string | null;
  created_at: string;
  deleted_at: string | null;
  [key: string]: unknown;
};

export type Guest = {
  id: string;
  event_id: string;
  anonymous_user_id: string;
  created_at: string;
  [key: string]: unknown;
};

export type Database = {
  public: {
    Tables: {
      events: {
        Row: WeddingEvent;
        Insert: {
          id?: string;
          name: string;
          event_code: string;
          event_date: string;
          cover_image?: string | null;
          theme?: WeddingTheme | Json | null;
          is_active?: boolean;
          created_at?: string;
          [key: string]: unknown;
        };
        Update: {
          id?: string;
          name?: string;
          event_code?: string;
          event_date?: string;
          cover_image?: string | null;
          theme?: WeddingTheme | Json | null;
          is_active?: boolean;
          created_at?: string;
          [key: string]: unknown;
        };
        Relationships: [];
      };
      photos: {
        Row: Photo;
        Insert: {
          id?: string;
          event_id: string;
          guest_id?: string | null;
          storage_path: string;
          caption?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          [key: string]: unknown;
        };
        Update: {
          id?: string;
          event_id?: string;
          guest_id?: string | null;
          storage_path?: string;
          caption?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          [key: string]: unknown;
        };
        Relationships: [
          {
            foreignKeyName: "photos_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          }
        ];
      };
      guests: {
        Row: Guest;
        Insert: {
          id?: string;
          event_id: string;
          anonymous_user_id: string;
          created_at?: string;
          [key: string]: unknown;
        };
        Update: {
          id?: string;
          event_id?: string;
          anonymous_user_id?: string;
          created_at?: string;
          [key: string]: unknown;
        };
        Relationships: [
          {
            foreignKeyName: "guests_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
