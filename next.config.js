/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        USE_MOCK_DATA: 'false',
        supabaseUrl: process.env.supabaseUrl,
        supabaseKey: process.env.supabaseKey,
    },
}

module.exports = nextConfig
