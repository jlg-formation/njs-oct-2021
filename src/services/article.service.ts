import {Article} from '../interfaces/Article';

let articles: Article[] = [
  {
    id: 'a1',
    name: 'Tournevis',
    price: 2.99,
    qty: 400,
  },
  {
    id: 'a2',
    name: 'Pince',
    price: 3.45,
    qty: 23,
  },
  {
    id: 'a3',
    name: 'Marteau',
    price: 1.5,
    qty: 12,
  },
];

function generateId(articleArray: Article[]) {
  return (
    'a' + (Math.max(0, ...articleArray.map((a) => +a.id.substring(1))) + 1)
  );
}

export class ArticleService {
  async create(article: Partial<Article>) {
    article.id = generateId(articles);
    articles.push(article as Article);
  }

  deleteAll() {
    articles = [];
  }

  deleteOne(id: string) {
    articles = articles.filter((a) => a.id !== id);
  }

  patchOne(partialArticle: Partial<Article>) {
    const article = articles.find((a) => a.id === partialArticle.id);
    if (!article) {
      throw new Error('not found');
    }
    Object.assign(article, partialArticle);
  }

  async retrieveAll() {
    return articles;
  }

  async retrieveOne(id: string) {
    return articles.find((a) => a.id === id);
  }

  rewriteOne(article: Article) {
    const index = articles.findIndex((a) => a.id === article.id);
    if (index === -1) {
      throw new Error('not found');
    }
    articles.splice(index, 1, article);
  }
}
