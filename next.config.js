/** @type {import('next').NextConfig} */
module.exports = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
    images: {
      formats: ['image/avif', 'image/webp'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'assets.vercel.com',
          port: '',
          pathname: '/image/upload/**',
        },
        {
          protocol: 'https',
          hostname: 'firebasestorage.googleapis.com',
        },
      ],
    },
  }
  