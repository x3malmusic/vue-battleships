module.exports = {
  apps : [{
    name: "battleships",
    script: "node -r esm server.js",
    instances: "1",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}