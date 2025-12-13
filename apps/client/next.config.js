/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@repo/ui"],
    images: {
        formats: ['image/avif', 'image/webp'],
    },
};

module.exports = nextConfig;
