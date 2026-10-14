import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  devIndicators: false,
  // PGlite nạp tệp .wasm theo đường dẫn thật trong node_modules → không cho bundler đóng gói lại
  serverExternalPackages: ["@electric-sql/pglite"],
  images: {
    // Ảnh tải lên qua CMS lưu ở Vercel Blob (lab 14)
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  experimental: {
    // 404 chung cho đường dẫn không khớp (layout gốc nằm trong [locale]) — src/app/global-not-found.tsx
    globalNotFound: true,
    // Server Action tải ảnh: cho phép thân yêu cầu tới 5 MB (ảnh ≤ 4 MB)
    serverActions: { bodySizeLimit: "5mb" },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
