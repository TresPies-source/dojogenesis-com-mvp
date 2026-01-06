/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  experimental: {
    serverActions: {
      allowedOrigins: ['*.pages.dev', 'dojogenesis.com'],
    },
  },
}

module.exports = nextConfig
