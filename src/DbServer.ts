import { sleep } from "./misc";
import { MongoClient } from "mongodb";

export interface DbServerOptions {
  uri: string;
}

let counter = 1;

export class DbServer {
  options: DbServerOptions = {
    uri: "TBD",
  };
  client: MongoClient;
  name: string;

  constructor(options: Partial<DbServerOptions>) {
    this.options = { ...this.options, ...options };
    this.client = new MongoClient(this.options.uri);
    this.name = "dbServer-" + counter;
    counter++;
  }

  async start() {
    await this.client.connect();
  }

  async stop() {
    await this.client.close(true);
  }
}
