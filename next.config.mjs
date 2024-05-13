/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'mrds.org.my'
            }
        ]
    }
};

export default nextConfig;
