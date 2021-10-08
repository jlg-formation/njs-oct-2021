import {WebServer} from './WebServer';
(async () => {
  const server = new WebServer({
    port: +(process.env.GESTION_STOCK_SERVER_PORT || 3000),
    dbUri:
      process.env.GESTION_STOCK_DBURI ||
      'mongodb://localhost:27017/gestion-client',
  });
  await server.start();
})();
