/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
        // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
        config.resolve.fallback = {
            fs: false
        }
    }
    return config;
  },

  env: {
    NEXT_FIREBASE_API_KEY: `${process.env.NEXT_FIREBASE_API_KEY}`,
    NEXT_FIREBASE_AUTH_DOMAIN: `${process.env.NEXT_FIREBASE_AUTH_DOMAIN}`,
    NEXT_FIREBASE_PROJECT_ID: `${process.env.NEXT_FIREBASE_PROJECT_ID}`,
    NEXT_FIREBASE_STORAGE_BUCKET: `${process.env.NEXT_FIREBASE_STORAGE_BUCKET}`,
    NEXT_FIREBASE_MESSAGING_SENDER_ID: `${process.env.NEXT_FIREBASE_MESSAGING_SENDER_ID}`,
    NEXT_FIREBASE_APP_ID: `${process.env.NEXT_FIREBASE_APP_ID}`,
  }
}

module.exports = nextConfig
