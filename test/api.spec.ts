import { WebServer } from "../src/WebServer";
import assert from "assert";
import got from "got";

const port = +(process.env.GESTION_STOCK_TEST_PORT || "3000");
const dbUri =
  process.env.GESTION_STOCK_DBURI ||
  "mongodb://localhost:27017/test-gestion-client";
const domain = `http://localhost:${port}`;

describe("Server API", function () {
  let server: WebServer;

  before(async function () {
    console.log("before all: api");
    server = new WebServer({ port, dbUri });
    await server.start();
    console.log("server started");
  });

  after(async function () {
    await server.stop();
    console.log("server stopped");
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
});
