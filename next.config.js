/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image Optimization - works with self-hosted (EC2)
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 100],
    minimumCacheTTL: 31536000, // 1 year for immutable assets
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.builder.io",
      },
      {
        protocol: "https",
        hostname: "cdn.builder.io",
      },
    ],
  },

  // Compression - important for EC2 self-hosted
  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  // Standalone output for EC2 deployment
  output: "standalone",

  // Server external packages (replaces webpack externals for server)
  serverExternalPackages: ["pino-pretty", "lokijs", "encoding"],

  // Experimental performance features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-accordion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "@tanstack/react-query",
      "framer-motion",
      "recharts",
    ],
  },

  // Turbopack configuration (Next.js 16 default bundler)
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  // Webpack configuration for non-Turbopack builds
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  // Caching Headers - configure nginx/cloudfront for production caching
  async headers() {
    return [
      {
        source: "/svg-assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/partners/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*.(jpg|jpeg|png|gif|webp|avif|svg)",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
