module.exports = {
  apps : [{
    name: "server",
    script: "./scripts/start-server.sh",
    log_file: "./logs/server.log",
    time: true
  }, {
    name: "client",
    script: "./scripts/start-client.sh",
    log_file: "./logs/client.log",
    time: true
  }]
}