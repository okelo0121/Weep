import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const LOADER = path.resolve(__dirname, 'src/visual-edits/component-tagger-loader.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
            {
                protocol: 'http',
                hostname: '**',
            },
        ],
        domains: [
            // Add your already allowed domains here,
            'slelguoygbfzlpylpxfs.supabase.co'
        ],
    },
    transpilePackages: ["thirdweb"],
    // outputFileTracingRoot: path.resolve(__dirname, '../../'),
    typescript: {
        ignoreBuildErrors: true,
    },
    // turbopack key removed as it might not be fully supported or same schema in 14.2.5 vs 15 
    // keeping empty object if needed or removing if it causes issues. The TS file had it empty.
    // The user removed --turbopack from dev script, so this key might be irrelevant or harmless.
    // I will keep it commented out to be safe or just minimal. 
    // Original had:
    // turbopack: {
    //   // Removed custom rules; no loaders specified
    // },

    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:3001/api/:path*', // Proxy to Backend
            },
        ];
    },
};

export default nextConfig;
