import { MongoClient } from "mongodb";

export interface DbServerOptions {
  uri: string;
}

export class DbServer {
  options: DbServerOptions = {
    uri: "TBD",
  };
  client: MongoClient;

  constructor(options: Partial<DbServerOptions>) {
    this.options = { ...this.options, ...options };
    console.log("this.options.uri: ", this.options.uri);
    this.client = new MongoClient(this.options.uri);
  }

  async start() {
    try {
      await this.client.connect();
      const databases = await this.client.db().admin().listDatabases();
      console.log("databases: ", databases);
    } catch (err) {
      console.log("mongodb connection failed.");
      console.log("err: ", err);
    }
  }

  async stop() {
    await this.client.close(true);
    console.log("db connection closed");
  }
}