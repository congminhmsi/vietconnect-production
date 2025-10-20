module.exports = {
  apps: [
    {
      name: "backend",
      script: "backend/dist/index.js",
      cwd: ".",
      env: {
        NODE_ENV: "production",
        PORT: 4000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 4000,
      },
      exec_mode: "fork",
      instances: 1,
    },
    {
      name: "frontend",
      script: "frontend/node_modules/next/dist/bin/next",
      args: "start",
      cwd: "frontend",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
        NEXT_PUBLIC_BACKEND_PORT: "4000",
        NEXT_PUBLIC_FRONTEND_PORT: "3000",
        NEXT_PUBLIC_SITE_NAME: "VIETCONNECT SOLUTIONS",
        NEXT_PUBLIC_SITE_DESCRIPTION: "Công ty cổ phần Vietconnect Solutions",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
        NEXT_PUBLIC_BACKEND_PORT: "4000",
        NEXT_PUBLIC_FRONTEND_PORT: "3000",
        NEXT_PUBLIC_SITE_NAME: "VIETCONNECT SOLUTIONS",
        NEXT_PUBLIC_SITE_DESCRIPTION: "Công ty cổ phần Vietconnect Solutions",
      },
      exec_mode: "fork",
      instances: 1,
    },
  ],
};
