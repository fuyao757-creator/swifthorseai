/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /** 手机/局域网访问 dev 时允许加载 _next 静态资源 */
  allowedDevOrigins: ["192.168.3.9", "localhost", "127.0.0.1"],
  experimental: {
    optimizePackageImports: ["recharts"],
  },
  async headers() {
    return [
      {
        source: "/videos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/hero-horses-poster.jpg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    const modelRedirects = [
      ["qwen3-7", "qwen3-7-max"],
      ["qwen-plus", "qwen-plus-flash"],
      ["qwen-flash", "qwen-plus-flash"],
      ["qwen3-6-max", "qwen3-max"],
    ];
    const newsRedirects = ["/en/news", "/zh-CN/news"].map((source) => ({
      source,
      destination: source.replace("/news", ""),
      permanent: true,
    }));
    const workflowsRedirects = ["/en/workflows", "/zh-CN/workflows"].flatMap(
      (source) => [
        {
          source,
          destination: source.replace("/workflows", ""),
          permanent: true,
        },
        {
          source: `${source}/:path*`,
          destination: source.replace("/workflows", ""),
          permanent: true,
        },
      ]
    );
    const recommendRedirects = ["/en/recommend", "/zh-CN/recommend"].map(
      (source) => ({
        source,
        destination: source.replace("/recommend", ""),
        permanent: true,
      })
    );
    return [
      ...newsRedirects,
      ...workflowsRedirects,
      ...recommendRedirects,
      {
        source: "/match-reference.html",
        destination: "/en/match",
        permanent: true,
      },
      {
        source: "/prompt-tool.html",
        destination: "/en/prompts",
        permanent: true,
      },
      ...modelRedirects.flatMap(([from, to]) => [
      {
        source: `/en/models/${from}`,
        destination: `/en/models/${to}`,
        permanent: true,
      },
      {
        source: `/zh-CN/models/${from}`,
        destination: `/zh-CN/models/${to}`,
        permanent: true,
      },
      ]),
    ];
  },
};

module.exports = nextConfig;
