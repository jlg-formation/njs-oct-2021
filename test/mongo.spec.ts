import assert from "assert";
import { DbServer } from "../src/DbServer";

const uri =
  "mongodb://localhost:27017/test-gestion-client?retryWrites=true&w=majority";

describe("Mongo", function () {
  let dbServer: DbServer;

  before(async function () {
    dbServer = new DbServer({ uri });
    console.log("before all: mongo");
    await dbServer.start();
  });

  after(async function () {
    await dbServer.stop();
  });

  it("should delete all data", async function () {
    this.timeout(30000);
    dbServer.client.db().collection("articles").deleteMany({});
    const result = await dbServer.client
      .db()
      .collection("articles")
      .find({})
      .toArray();
    assert.deepStrictEqual(result, []);
  });

  it("should create some data", async function () {
    this.timeout(30000);
    await dbServer.client.db().collection("articles").insertOne({
      name: "machin",
    });
    const result = await dbServer.client
      .db()
      .collection("articles")
      .find({})
      .toArray();
    assert.deepStrictEqual(result.length, 1);
    assert.deepStrictEqual(result[0].name, "machin");
  });

  it("should remove the data", async function () {
    this.timeout(30000);

    let result = await dbServer.client
      .db()
      .collection("articles")
      .find({})
      .toArray();
    await dbServer.client
      .db()
      .collection("articles")
      .deleteOne({ _id: result[0]._id });
    result = await dbServer.client
      .db()
      .collection("articles")
      .find({})
      .toArray();
    assert.deepStrictEqual(result.length, 0);
  });
});
