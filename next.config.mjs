/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'pub-67ca5e2b9cc8442aae3f9058614ea98.r2.dev', // Cloudflare R2 domain
      'doodad-videos.r2.cloudflarestorage.com'      // Alternative R2 domain
    ],
  },
};

export default nextConfig; 