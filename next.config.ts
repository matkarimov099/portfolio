import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { hostname: "api.microlink.io" },
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "opengraph.githubassets.com" },
      { hostname: "media2.dev.to" },
      { hostname: "dev-to-uploads.s3.amazonaws.com" },
    ],
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
