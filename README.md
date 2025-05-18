# DoodadAI - Video Roasting App

This is a Next.js application for roasting videos using AI.

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file in the root directory with the following variables:
   ```
   # OpenAI API credentials
   OPENAI_API_KEY=your_openai_api_key_here

   # R2 (Cloudflare) configuration
   R2_ENDPOINT_URL=your_r2_endpoint_url
   R2_ACCESS_KEY_ID=your_r2_access_key_id
   R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
   R2_BUCKET_NAME=doodad-videos
   R2_PUBLIC_URL_BASE=your_r2_public_url_base

   # Supabase configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the development server:
   ```
   npm run dev
   ```

## Build
To build the project for production:
```
npm run build
```

## Deployment
The project can be deployed on Vercel or any platform that supports Next.js applications. 