module.exports = {
  apps: [
    {
      name: "e2e-forever",
      script: "cmd.exe",
      args: "/c npx playwright test tests/e2e.spec.ts",
      autorestart: true,
      restart_delay: 15000,
      time: true,
    },
    {
      name: "login-forever",
      script: "cmd.exe",
      args: "/c npx playwright test tests/login.spec.ts",
      autorestart: true,
      restart_delay: 15000,
      time: true,
    },
    {
      name: "stamping-peranan-ejen-duti-setem-forever",
      script: "cmd.exe",
      args: "/c npx playwright test tests/stamping-peranan-ejen-duti-setem.spec.ts",
      autorestart: true,
      restart_delay: 15000,
      time: true,
    },
    {
      name: "stamping-peranan-ejen-firma-guaman-forever",
      script: "cmd.exe",
      args: "/c npx playwright test tests/stamping-peranan-ejen-firma-guaman.spec.ts",
      autorestart: true,
      restart_delay: 15000,
      time: true,
    },
  ],
};
