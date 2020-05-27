module.exports = {
  apps: [
    {
      name: "server",
      script: 'yarn --cwd "./server" start:dev',
      log: "logs/server.log"
    },
    {
      name: "client",
      script: 'yarn --cwd "./client" start',
      log: "logs/client.log"
    },
  ],
};
