/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    remotePatterns: [new URL('https://randomuser.me/**')],
  },
};

export default nextConfig;
