import assert from "assert";
import got from "got";

describe("Server API", function () {
  it("should return the date", async function () {
    this.timeout(30000);

    const response = await got
      .get("http://localhost:3000/api/now")
      .json<{ date: string }>();

    assert(typeof response.date === "string");
  });
});
