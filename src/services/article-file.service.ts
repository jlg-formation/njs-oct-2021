import { promises } from "fs";
import { Article } from "../interfaces/Article";

const DATAFILE = "data/articles.json";

let articles: Article[] = [];

function generateId(articles) {
  return "a" + (Math.max(0, ...articles.map((a) => +a.id.substring(1))) + 1);
}

function generateId2(articles) {
  return Date.now() + "_" + Math.floor(Math.random() * 1e9);
}

export class ArticleFileService {
  constructor() {
    this.init();
  }

  async init() {
    try {
      const str = await promises.readFile(DATAFILE, { encoding: "utf-8" });
      const json = JSON.parse(str);
      if (!(json instanceof Array)) {
        throw new Error(`the file ${DATAFILE} does not contain an array`);
      }
      articles = json;
    } catch (err) {
      console.error("err: ", err);
      process.abort();
    }
  }

  async save() {
    try {
      await promises.writeFile(
        DATAFILE,
        JSON.stringify(articles, undefined, 2)
      );
    } catch (err) {
      console.error("err: ", err);
      throw err;
    }
  }

  async create(article: Partial<Article>) {
    article.id = generateId(articles);
    articles.push(article as Article);
    this.save();
  }

  deleteAll() {
    articles = [];
    this.save();
  }

  deleteOne(id: string) {
    articles = articles.filter((a) => a.id !== id);
    this.save();
  }

  patchOne(partialArticle: Partial<Article>) {
    const article = articles.find((a) => a.id === partialArticle.id);
    if (!article) {
      throw new Error("not found");
    }
    Object.assign(article, partialArticle);
    this.save();
  }

  async retrieveAll() {
    return articles;
  }

  async retrieveOne(id: string) {
    const article = articles.find((a) => a.id === id);
    return article;
  }

  rewriteOne(article: Article) {
    const index = articles.findIndex((a) => a.id === article.id);
    if (index === -1) {
      throw new Error("not found");
    }
    articles.splice(index, 1, article);
    this.save();
  }
}
