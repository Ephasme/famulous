module.exports = {
  apps: [
    {
      name: "famulous",
      script: "./server/dist/app/index.js",
      log: "./logs/famulous.log",
      env: {
        "NODE_ENV": "production",
        "PORT": 80
      }
    },
  ],
};
