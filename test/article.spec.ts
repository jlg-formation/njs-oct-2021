import { WebServer } from "../src/WebServer";
import assert from "assert";
import got from "got";
import { Article } from "../src/interfaces/Article";

const port = +(process.env.GESTION_STOCK_TEST_PORT || "3000");

const domain = `http://localhost:${port}`;

const url = `${domain}/api/articles`;

describe("Article API", function () {
  let server = new WebServer({ port });

  before(async function () {
    await server.start();
  });

  after(async function () {
    await server.stop();
  });

  it("should delete all", async function () {
    this.timeout(10000);
    const response = await got.delete(url, {
      resolveBodyOnly: false,
    });
    assert(response.statusCode === 204);
  });

  it("should get all", async function () {
    this.timeout(10000);
    const articles: Article[] = await got.get(url).json();
    assert(articles.length === 0);
  });

  it("should create one", async function () {
    this.timeout(10000);
    const article: Partial<Article> = {
      name: "Truc",
      price: 2.34,
      qty: 100,
    };
    const createdArticle: Article = await got
      .post(url, {
        json: article,
      })
      .json();
    assert(createdArticle.id !== undefined);
    const articles: Article[] = await got.get(url).json();
    assert.deepStrictEqual(articles.length, 1);
  });

  it("should retrieve one", async function () {
    this.timeout(10000);
    const articles: Article[] = await got.get(url).json();
    assert.deepStrictEqual(articles.length, 1);
    const id = articles[0].id;
    const article: Article = await got.get(`${url}/${id}`).json();
    assert.deepStrictEqual(article, articles[0]);
  });
});
