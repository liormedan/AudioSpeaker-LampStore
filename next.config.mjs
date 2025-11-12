/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false, // Enable ESLint checks during builds
  },
  typescript: {
    ignoreBuildErrors: false, // Enable TypeScript error checking
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig