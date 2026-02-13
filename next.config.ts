import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // Remove output: 'export' for development
    // You can add it back when you want to build static files
    images: {
        unoptimized: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: false,
    },
};

export default nextConfig;
