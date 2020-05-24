module.exports = {
  apps: [
    {
      name: "server",
      script: 'yarn --cwd "./server" start',
    },
    {
      name: "client",
      script: 'yarn --cwd "./client" start',
    },
  ],
};
