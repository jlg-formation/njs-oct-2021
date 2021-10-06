import express, { Express } from "express";
import { Server } from "http";
import serveIndex from "serve-index";
import { api } from "./api";

export interface WebServerOptions {
  port: number;
}

export class WebServer {
  options: WebServerOptions = {
    port: 3000,
  };

  app: Express;
  server: Server;

  constructor(options: Partial<WebServerOptions>) {
    this.options = { ...this.options, ...options };

    console.log("About to start a web server");
    const app = express();

    app.use((req, res, next) => {
      console.log("path", req.url);
      next();
    });

    app.use("/api", api);

    app.use(express.static("."));
    app.use(serveIndex(".", { icons: true }));

    this.app = app;
  }

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      const errorCallback = function (err) {
        reject(err);
      };

      const server = this.app.listen(this.options.port, () => {
        console.log(`Server started on port ${this.options.port}`);
        this.server = server;
        server.removeListener("error", errorCallback);
        resolve();
      });
      server.once("error", errorCallback);
    });
  }

  stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.server) {
        reject("Cannot stop a server if it was not started before.");
        return;
      }
      this.server.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }
}
