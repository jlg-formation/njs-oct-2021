import { WebServer } from "./../src/WebServer";
import assert from "assert";
import got from "got";

const port = +(process.env.GESTION_STOCK_TEST_PORT || "3000");

const domain = `http://localhost:${port}`;

describe("Server API", function () {
  let server = new WebServer({ port });

  before(async function () {
    await server.start();
  });

  after(async function () {
    await server.stop();
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
