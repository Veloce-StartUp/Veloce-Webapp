/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Serve resized WebP copies instead of the multi-MB originals in /public.
    // Those files rarely change, so optimised copies are cached for 31 days.
    minimumCacheTTL: 2678400,
  },
}

export default nextConfig
