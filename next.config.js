/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
      domains: ['tweeter-social-media-app.s3.us-east-1.amazonaws.com',],
    },   
}

module.exports = nextConfig
