import assert from "assert";
import got from "got";
import { WebServer } from "../src/WebServer";

const port = +(process.env.GESTION_STOCK_TEST_PORT || "3000");
const domain = `http://localhost:${port}`;

describe("Server start and stop", function () {
  it("should start and stop the server ", async function () {
    this.timeout(30000);

    const server = new WebServer({ port });
    await server.start();
    const response = await got
      .get(domain + "/api/counter")
      .json<{ counter: number }>();
    assert(typeof response.counter === "number");
    await server.stop();
    try {
      const response2 = await got.get(domain + "/api/counter");
    } catch (err) {
      console.log("err: ", err);
    }
  });
});
