import {ObjectId} from 'mongodb';
import {Article} from '../interfaces/Article';
import {WebServer} from '../WebServer';

function refactorArticle(mongoArticle: any) {
  const result = mongoArticle;
  result.id = result._id;
  delete result._id;
  return result;
}

function toObjectId(id: string) {
  try {
    return new ObjectId(id);
  } catch (err) {
    throw new Error('not found');
  }
}

export class ArticleMongoService {
  private dbServer = this.webServer.dbServer;
  constructor(private webServer: WebServer) {
    console.log(
      'ArticleMongoService dbServer: ',
      this.webServer.name,
      this.dbServer.name
    );
  }

  async create(article: Partial<Article>) {
    const result = await this.dbServer.client
      .db()
      .collection('articles')
      .insertOne(article);
    return {...article, id: result.insertedId.toString()};
  }

  async deleteAll() {
    console.log('deleteAll - webServer name: ', this.webServer.name);
    console.log('deleteAll - dbserver name: ', this.dbServer.name);
    const databases = await this.dbServer.client.db().admin().listDatabases();
    console.log('deleteAll - databases: ', databases);
    await this.dbServer.client.db().collection('articles').deleteMany({});
  }

  async deleteOne(id: string) {
    await this.dbServer.client
      .db()
      .collection('articles')
      .deleteOne({_id: toObjectId(id)});
  }

  async patchOne(partialArticle: Partial<Article>) {
    const id = partialArticle.id;
    await this.dbServer.client
      .db()
      .collection('articles')
      .findOneAndUpdate({_id: toObjectId(id)}, {$set: partialArticle});
  }

  async retrieveAll() {
    const result = await this.dbServer.client
      .db()
      .collection('articles')
      .find({})
      .toArray();
    console.log('result: ', result);
    result.forEach((a) => refactorArticle(a));
    console.log('result2: ', result);

    return result;
  }

  async retrieveOne(id: string) {
    try {
      const result = await this.dbServer.client
        .db()
        .collection('articles')
        .findOne({_id: toObjectId(id)});
      refactorArticle(result);
      return result;
    } catch (err) {
      if (err.message === 'not found') {
        return undefined;
      }
      throw err;
    }
  }

  async rewriteOne(article: Article) {
    const id = article.id;
    await this.dbServer.client
      .db()
      .collection('articles')
      .findOneAndReplace({_id: toObjectId(id)}, article);
  }
}
