/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        USE_MOCK_DATA: process.env.USE_MOCK_DATA === 'true' ? 'true' : 'false',
    },
    images: {
        domains: [
            'raw.githubusercontent.com', // Add GitHub domain for banner images
            'qlmggcngjauqncighoun.supabase.co', // Add Supabase domain
        ],
    },
}

module.exports = nextConfig
