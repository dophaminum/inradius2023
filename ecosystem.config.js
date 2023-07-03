const path = require("path");

module.exports = {
  apps: [
    {
      name: "remix_main_app",
      script: "node_modules/@remix-run/serve/dist/cli.js",
      args: "build",
      exec_mode: "fork",
      env: {
        PORT: 4264,
        NODE_ENV: "production",
      },
    },
    {
      name: "next_amp_app",
      script: "node_modules/next/dist/bin/next",
      cwd: path.resolve("./amp"),
      args: "start",
      env: {
        PORT: 4263,
        NODE_ENV: "production",
      },
    },
  ],
};
