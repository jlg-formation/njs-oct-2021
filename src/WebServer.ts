export interface WebServerOptions {
  port: number;
}

export class WebServer {
  options: WebServerOptions = {
    port: 3000,
  };

  constructor(options: Partial<WebServerOptions> = {}) {
    this.options = { ...this.options, ...options };
  }

  async start() {
    throw new Error("Method not implemented.");
  }

  async stop() {
    throw new Error("Method not implemented.");
  }
}
