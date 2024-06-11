module.exports = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "console.cloudinary.com",
        port: "",
        pathname: "/mdirhzlg1c/**",
      },
    ],
  },
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      domains: ['res.cloudinary.com'],
  },
}

module.exports = nextConfig
