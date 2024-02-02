/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: 'build',
    // Disable strict mode because that, by design, calls 'useEffect' twice, only in DEBUG mode
    // but ScanbotSDK initialization is a resource-consuming operation and we don't want to call it twice even in DEBUG mode
    reactStrictMode: false
};

export default nextConfig;
