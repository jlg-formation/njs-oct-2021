import express, {Express} from 'express';
import {Server} from 'http';
import serveIndex from 'serve-index';
import {api} from './api';
import {DbServer} from './DbServer';
import {frontendRouter} from './routers/frontend.router';

export interface WebServerOptions {
  port: number;
  dbUri: string;
}

let counter = 1;

export class WebServer {
  options: WebServerOptions = {
    port: 3000,
    dbUri: 'TBD',
  };

  app: Express;
  server: Server;
  dbServer: DbServer;
  name: string;

  constructor(options: Partial<WebServerOptions>) {
    this.name = 'webserver' + counter;
    counter++;
    this.options = {...this.options, ...options};

    this.dbServer = new DbServer({uri: this.options.dbUri});
    const app = express();

    app.set('view engine', 'ejs');
    app.set('views', './views');

    app.use((req, res, next) => {
      console.log('path', req.url);
      next();
    });

    app.use('/', frontendRouter(this));

    app.use('/api', api(this));

    app.use(express.static('.'));
    app.use(serveIndex('.', {icons: true}));

    this.app = app;
  }

  start(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      await this.dbServer.start();
      const errorCallback = async (err) => {
        try {
          await this.dbServer.stop();
        } finally {
          reject(err);
        }
      };

      const server = this.app.listen(this.options.port, () => {
        console.log(`Server started on port ${this.options.port}`);
        this.server = server;
        server.removeListener('error', errorCallback);
        resolve();
      });
      server.once('error', errorCallback);
    });
  }

  stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.server) {
        reject(new Error('Cannot stop a server if it was not started before.'));
        return;
      }
      this.server.close(async (err) => {
        await this.dbServer.stop();
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }
}
