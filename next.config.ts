import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https", // Accepter les images via le protocole HTTPS
        hostname: "**", // Accepter tous les domaines
        port: "", // Accepter toutes les connexions
      },
    ],
  },
};

export default nextConfig;
