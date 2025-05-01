import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  async rewrites() {
    return [
      {
        source: '/api/:path*',  // Redireciona requisições para /api/* 
        destination: 'http://localhost:8081/api/:path*',  // Para o backend que está rodando no NestJS
      },
    ];
  },
  /* config options here */
};

export default nextConfig;
