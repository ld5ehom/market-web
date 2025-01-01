/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        USE_MOCK_DATA: 'false',
        SUPABASE_URL: process.env.SUPABASE_URL, // Securely load from .env
        SUPABASE_KEY: process.env.SUPABASE_KEY, // Securely load from .env
    },
    images: {
        domains: [
            new URL(process.env.SUPABASE_URL).hostname, // Dynamically extract hostname for Supabase
            'raw.githubusercontent.com', // GitHub 도메인 추가
        ],
    },
}

module.exports = nextConfig
