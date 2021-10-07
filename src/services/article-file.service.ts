import { promises } from "fs";
import { Article } from "../interfaces/Article";
import { BehaviorSubject, debounceTime } from "rxjs";

const DATAFILE = "data/articles.json";

let articles: Article[] = [];

function generateId(articles) {
  return "a" + (Math.max(0, ...articles.map((a) => +a.id.substring(1))) + 1);
}

function generateId2(articles) {
  return Date.now() + "_" + Math.floor(Math.random() * 1e9);
}

export class ArticleFileService {
  articles$ = new BehaviorSubject<Article[]>([]);
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

      this.articles$.pipe(debounceTime(1000)).subscribe({
        next: (articles) => {
          this.save(articles);
        },
      });
    } catch (err) {
      console.error("err: ", err);
      process.abort();
    }
  }

  async save(articles) {
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
    this.articles$.next(articles);
  }

  deleteAll() {
    articles = [];
    this.articles$.next(articles);
  }

  deleteOne(id: string) {
    articles = articles.filter((a) => a.id !== id);
    this.articles$.next(articles);
  }

  patchOne(partialArticle: Partial<Article>) {
    const article = articles.find((a) => a.id === partialArticle.id);
    if (!article) {
      throw new Error("not found");
    }
    Object.assign(article, partialArticle);
    this.articles$.next(articles);
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
    this.articles$.next(articles);
  }
}
