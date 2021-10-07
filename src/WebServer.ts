import { DbServer } from "./DbServer";
import express, { Express } from "express";
import { Server } from "http";
import serveIndex from "serve-index";
import { api } from "./api";

export interface WebServerOptions {
  port: number;
  dbUri: string;
}

let counter = 50;

export class WebServer {
  options: WebServerOptions = {
    port: 3000,
    dbUri: "TBD",
  };

  app: Express;
  server: Server;
  dbServer: DbServer;
  name: string;

  constructor(options: Partial<WebServerOptions>) {
    this.name = "webserver" + counter;
    counter++;
    this.options = { ...this.options, ...options };

    console.log("this.options.dbUri: ", this.options.dbUri);
    this.dbServer = new DbServer({ uri: this.options.dbUri });
    const app = express();

    app.use((req, res, next) => {
      console.log("path", req.url);
      next();
    });

    app.use("/api", api(this));

    app.use(express.static("."));
    app.use(serveIndex(".", { icons: true }));

    this.app = app;
  }

  start(): Promise<void> {
    console.log("About to start a web server");
    return new Promise(async (resolve, reject) => {
      await this.dbServer.start();
      const errorCallback = async (err) => {
        console.log(
          "error while starting the webserver. try to stop the dbserver..."
        );
        await this.dbServer.stop();
        console.log("dbserver stopped. rejecting.");
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
      this.server.close(async (err) => {
        console.log("about to stop the dbserver");
        await this.dbServer.stop();
        console.log("dbserver stopped.");
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }
}
