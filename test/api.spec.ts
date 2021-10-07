import { WebServer } from "../src/WebServer";
import assert from "assert";
import got from "got";
import { Article } from "../src/interfaces/Article";

const port = +(process.env.GESTION_STOCK_TEST_PORT || "3000");
const dbUri =
  process.env.GESTION_STOCK_DBURI ||
  "mongodb://localhost:27017/test-gestion-client";
const domain = `http://localhost:${port}`;

describe("Server API", function () {
  let server: WebServer;

  it("starts the server", async function () {
    console.log("before all: api");
    server = new WebServer({ port, dbUri });
    await server.start();
    console.log("server started");
  });

  it("should return the date", async function () {
    this.timeout(30000);
    const response = await got
      .get(domain + "/api/now")
      .json<{ date: string }>();

    assert(typeof response.date === "string");
  });

  it("should return the counter", async function () {
    this.timeout(30000);

    const response = await got
      .get(domain + "/api/counter")
      .json<{ counter: number }>();

    assert(typeof response.counter === "number");
  });

  it("should return the articles list", async function () {
    this.timeout(30000);

    const response = await got.get(domain + "/api/articles").json<Article[]>();

    assert(response instanceof Array);
  });

  it("stops the server", async function () {
    this.timeout(30000);
    console.log("after all: api");
    await server.stop();
    console.log("server stopped");
  });
});
