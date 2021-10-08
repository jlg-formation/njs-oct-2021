import {promises} from 'fs';
import {Article} from '../interfaces/Article';
import {BehaviorSubject, debounceTime} from 'rxjs';

const DATAFILE = 'data/articles.json';

let articles: Article[] = [];

function generateId(articleArray: Article[]) {
  return (
    'a' + (Math.max(0, ...articleArray.map((a) => +a.id.substring(1))) + 1)
  );
}

export class ArticleFileService {
  articles$ = new BehaviorSubject<Article[]>([]);
  constructor() {
    this.init();
  }

  async init() {
    try {
      const str = await promises.readFile(DATAFILE, {encoding: 'utf-8'});
      const json = JSON.parse(str);
      if (!(json instanceof Array)) {
        throw new Error(`the file ${DATAFILE} does not contain an array`);
      }
      articles = json;

      this.articles$.pipe(debounceTime(1000)).subscribe({
        next: (articleArray) => {
          this.save(articleArray);
        },
      });
    } catch (err) {
      console.error('err: ', err);
      process.abort();
    }
  }

  async save(articleArray: Article[]) {
    try {
      await promises.writeFile(
        DATAFILE,
        JSON.stringify(articleArray, undefined, 2)
      );
    } catch (err) {
      console.error('err: ', err);
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
      throw new Error('not found');
    }
    Object.assign(article, partialArticle);
    this.articles$.next(articles);
  }

  async retrieveAll() {
    return articles;
  }

  async retrieveOne(id: string): Promise<Article> {
    return articles.find((a) => a.id === id);
  }

  rewriteOne(article: Article) {
    const index = articles.findIndex((a) => a.id === article.id);
    if (index === -1) {
      throw new Error('not found');
    }
    articles.splice(index, 1, article);
    this.articles$.next(articles);
  }
}
