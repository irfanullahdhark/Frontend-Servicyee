import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images: {
      domains: [
        'images.unsplash.com',
        'images.pexels.com', 
        'cdn-icons-png.flaticon.com',
        'cdn.pixabay.com',
        'commondatastorage.googleapis.com', 
        'sample-videos.com', 
        'randomuser.me',
        'source.unsplash.com',
        'storyset.com',
        'img.freepik.com',
        '192.168.1.72' // Use only the hostname, not the port
      ], // allow Storyset/Freepik assets
      remotePatterns: [
        {
          protocol: 'http',
          hostname: '192.168.1.72',
          port: '8005',
        },
      ],
  },
  // i18n is removed if using App Router

};

export default nextConfig;