import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ui-avatars.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'randomuser.me',
                pathname: '/api/portraits/**',
            },
        ],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true
    },
};

export default nextConfig;