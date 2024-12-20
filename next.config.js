/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");
import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";

const cspHeader = `
    default-src 'self' *.clerk.accounts.dev clerk.accounts.dev *.clerk.com;
    script-src 'self' 'unsafe-eval' 'unsafe-inline' *.clerk.accounts.dev clerk.accounts.dev *.clerk.com;
    worker-src 'self' blob:;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: *.clerk.accounts.dev clerk.accounts.dev *.clerk.com;
    frame-src 'self' *.clerk.accounts.dev clerk.accounts.dev *.clerk.com;
    connect-src 'self' 
      *.clerk.accounts.dev 
      clerk.accounts.dev 
      *.clerk.com 
      *.uploadthing.com 
      uploadthing.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`

/** @type {import("next").NextConfig} */
const config = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [{ hostname: "utfs.io" }],
  },
  experimental: {
    serverComponentsExternalPackages: ["pino", "pino-pretty"],
  },
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  transpilePackages: ["next-mdx-remote"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "Cache-Control", value: "no-cache, no-store, max-age=0, must-revalidate" },
          { key: "Content-Security-Policy", value: cspHeader.replace(/\n/g, "") },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
});
export default withMDX(config);
