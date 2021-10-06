import { WebServer } from "./WebServer";
(async () => {
  const server = new WebServer({
    port: +(process.env.GESTION_STOCK_SERVER_PORT || 3000),
  });
  await server.start();
})();
