/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
      domains: ['tweeter-social-media-app.s3.us-east-1.amazonaws.com',],
    },   
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
}

module.exports = nextConfig
