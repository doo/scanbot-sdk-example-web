/** @type {import('next').NextConfig} */
const nextConfig = {

    /**
     * Uncomment the following two lines and run 'npm run build' to build a static site in the 'dist' directory. 
     * That site can then be deployed anywhere that's able to serve basic html/css/js.
     * Do not keep these lines uncommented in the source code, because it will break the development server,
     * also, shutting down the development server when building, else the dev server will automatically clean the dist directory
     */
    // output: 'export',
    // distDir: 'dist',

    /**
     * Disable strict mode because that, by design, calls 'useEffect' twice, only in DEBUG mode
     * but ScanbotSDK initialization is a resource-consuming operation and we don't want to call it twice even in DEBUG mode
     */
    reactStrictMode: false
};

export default nextConfig;
