import { sleep } from "./misc";
import { MongoClient } from "mongodb";

export interface DbServerOptions {
  uri: string;
}

let counter = 10;

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
    try {
      await this.client.connect();
      // const databases = await this.client.db().admin().listDatabases();
    } catch (err) {
      console.error("err: ", err);
    }
  }

  async stop() {
    await this.client.close(true);
  }
}
