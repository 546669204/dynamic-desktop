/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  // Note: This feature is required to use NextJS Image in SSG mode.
  // 请参见 https://nextjs.org/docs/messages/export-image-api 来了解不同的解决方法。
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,

  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    }); // 针对 SVG 的处理规则
    return config;
  },
  experimental: { appDir: true }
}

module.exports = nextConfig
