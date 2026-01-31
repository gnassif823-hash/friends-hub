# Friends Hub - Production Ready

A real-time coordination app for close friends, featuring live status updates, map sharing, group chat, and video calls.

## Features
- **Real-time Status Board**: See who is available or busy instantly.
- **Live Map**: View friends' locations on an interactive map.
- **Group Lounge**: Real-time chat powered by Supabase.
- **Call Center**: Integrated video conferencing using Jitsi Meet.
- **Deep Dark Mode**: Sleek, modern UI.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS v4
- **Backend**: Supabase (Auth, Database, Realtime, Storage)
- **Video**: Jitsi Meet React SDK
- **Maps**: React Leaflet + OpenStreetMap

## Setup & Installation

### 1. Clone & Install
```bash
git clone <repo-url>
cd friends-hub
npm install
```

### 2. Configure Supabase
1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** and run the contents of `src/lib/schema.sql`.
   - This creates the `profiles` and `messages` tables and sets up security policies.
3. Go to **Storage**, create a new public bucket named `avatars`.
4. Copy `.env.example` to `.env` and add your keys:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

### 3. Run Locally
```bash
npm run dev
```

## Deployment

### Vercel / Netlify
This project is configured for "one-click" deployment.
1. Push to GitHub/GitLab.
2. Import project into Vercel or Netlify.
3. **IMPORTANT**: Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the hosting dashboard's Environment Variables settings.
4. Deploy!

## IoT Integration (ESP32)
To update status from an external device, send a PATCH request:
- **URL**: `https://<PROJECT_REF>.supabase.co/rest/v1/profiles?id=eq.<USER_UUID>`
- **Headers**: `apikey: <ANON_KEY>`, `Authorization: Bearer <ANON_KEY>`, `Content-Type: application/json`
- **Body**: `{"status": "Busy"}`
