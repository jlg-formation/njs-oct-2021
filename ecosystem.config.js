module.exports = {
  apps: [
    {
      script: 'build/src/server.js',
      instances: 'max',
      env: {
        GESTION_STOCK_SERVER_PORT: 3000,
        NODE_ENV: 'production',
        GESTION_STOCK_DBURI: 'mongodb://localhost:27017/gestion-stock-prod',
      },
      // env_production: {
      //   PORT: 80,
      //   NODE_ENV: "production",
      // },
    },
  ],
};
