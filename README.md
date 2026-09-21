# 🌸 Wedding Moments — QR Live Camera & Shared Wedding Gallery

A production-ready Next.js 15 web application designed for weddings. Guests scan a printable table QR code on their mobile devices, capture photos with their phone cameras, and watch all guest memories blossom together in a shared real-time gallery.

Built for the wedding celebration of **Rhein & Ruschelle** (October 16, 2026) featuring an elegant **Spring Pastel** botanical watercolor floral aesthetic.

---

## ✨ Features

- **Instant Mobile QR Access**: Guests scan the table QR code and open the wedding landing page without installing any app.
- **Zero Registration / Friction**: Automatic Supabase Anonymous Authentication assigns every guest an independent session without requiring emails or passwords.
- **Mobile-First Live Camera**: Direct browser camera access with rear-camera preference (`facingMode: environment`), camera flip, and device gallery fallback.
- **Client-Side WebP Compression**: Large 8–15MB phone camera captures are automatically scaled (max 1600px) and converted to WebP (~150–350KB) on an in-browser HTML5 canvas before uploading to conserve Supabase storage.
- **Supabase Realtime Live Gallery**: Responsive 2-column mobile / 4-column desktop masonry gallery that updates live as guests upload photos—no page refresh required.
- **Photo Lightbox**: Fullscreen photo preview with high-res display and one-tap photo download.
- **Admin Moderation Dashboard**: Real-time stats (live photos, storage usage estimate, status toggle), instant photo moderation/soft-deletion, and printable QR table card generator.
- **Printable Wedding QR Card**: Generates high-resolution PNG QR codes formatted on a digital card ready for table printing.

---

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database & Realtime**: Supabase PostgreSQL & Supabase Realtime
- **Storage**: Supabase Storage (`wedding-photos` bucket)
- **Authentication**: Supabase Anonymous Auth
- **Icons**: Lucide React
- **Deployment**: Vercel

---

## 🚀 Quick Start (Local Development)

### 1. Clone the repository

```bash
git clone https://github.com/zynxoso/rheiandruschelle_qr.git
cd rheiandruschelle_qr
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-secret-key
ADMIN_PASSPHRASE=your-admin-passphrase
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🗄️ Supabase Setup Guide

### Step 1: Create Supabase Project
1. Log in to [Supabase](https://supabase.com).
2. Create a new project (or use your existing project `ocyyiceylxrmuezpfkyl`).
3. Under **Project Settings → API**, retrieve:
   - `Project URL`
   - `anon public` key
   - `service_role` secret key

### Step 2: Enable Anonymous Authentication
1. In your Supabase Dashboard, go to **Authentication** → **Sign In / Providers**.
2. Scroll down to **Anonymous sign-in**.
3. Toggle **Enable Anonymous sign-in** to `ON`.
4. Click **Save**.

### Step 3: Run Database Migrations
1. In your Supabase Dashboard, go to the **SQL Editor**.
2. Click **New Query**.
3. Open [`supabase/schema.sql`](./supabase/schema.sql) from this repository, copy its entire contents, paste it into the editor, and click **Run**.
4. *(Optional)* Open [`supabase/seed.sql`](./supabase/seed.sql), copy and paste into the editor, and click **Run** to seed the default Rhein & Ruschelle event.

### Step 4: Verify Storage Bucket
The `schema.sql` script automatically creates the `wedding-photos` storage bucket.
To verify:
1. In the Supabase Dashboard, click **Storage**.
2. Ensure the bucket `wedding-photos` is listed and configured as **Public**.
3. Verify that allowed MIME types include `image/webp`, `image/jpeg`, and `image/png`.

---

## 🌐 Deploy to Vercel

1. Push your changes to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete Wedding Moments MVP"
   git push -u origin main
   ```
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New → Project**.
3. Import the `zynxoso/rheiandruschelle_qr` repository.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSPHRASE`
5. Click **Deploy**. Vercel will automatically build and assign a production URL.

---

## 📱 Routes & User Flows

| Route | Description |
|---|---|
| `/` | Landing page with feature overview and link to demo event |
| `/create` | Create a new wedding event with custom code and theme |
| `/e/[eventCode]` | Digital wedding invitation landing page scanned from QR code |
| `/e/[eventCode]/camera` | Fullscreen mobile live camera capture with WebP compression |
| `/e/[eventCode]/gallery` | Live real-time shared photo gallery with Supabase sync |
| `/admin/[eventId]` | Admin dashboard with moderation grid and printable QR card |

---

## 🎨 Spring Pastel Theme Details

- **Couple**: Rhein & Ruschelle
- **Wedding Date**: October 16, 2026
- **Ceremony**: 3:00 PM Iglesia Ni Cristo Lokal ng Guimba
- **Reception**: 4:00 PM La Herminias Resort
- **Color Palette**:
  - Background: Warm Ivory (`#FDFBF7`)
  - Accent Calligraphy: Coral Pink (`#E26D5C`)
  - Wildflower Florals: Soft Lavender (`#9B8EB9`), Powder Blue (`#8FA8CF`), Buttercup Yellow (`#F3CA68`), Sage Green (`#8DA38B`), and Soft Mint (`#A2C5AC`)
  - Contrast Charcoal: (`#242D35`)
