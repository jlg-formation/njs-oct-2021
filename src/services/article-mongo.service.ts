import { DbServer } from "./../DbServer";
import { Article } from "../interfaces/Article";
import { ObjectId } from "mongodb";

function refactorArticle(mongoArticle: any) {
  const result = mongoArticle;
  result.id = result._id;
  delete result._id;
  return result;
}

export class ArticleMongoService {
  constructor(private dbServer: DbServer) {}

  async create(article: Partial<Article>) {
    await this.dbServer.db.collection("articles").insertOne(article);
  }

  async deleteAll() {
    await this.dbServer.db.collection("articles").deleteMany({});
  }

  async deleteOne(id: string) {
    let objectId: ObjectId;
    try {
      console.log("about to generate objectid");
      objectId = new ObjectId(id);
      console.log("objectid generated");
    } catch (err) {
      throw new Error("not found");
    }
    await this.dbServer.db.collection("articles").deleteOne({ _id: objectId });
  }

  async patchOne(partialArticle: Partial<Article>) {
    const id = partialArticle.id;
    await this.dbServer.db
      .collection("articles")
      .findOneAndUpdate({ _id: new ObjectId(id) }, partialArticle);
  }

  async retrieveAll() {
    const result = await this.dbServer.db
      .collection("articles")
      .find({})
      .toArray();
    console.log("result: ", result);
    result.forEach((a) => refactorArticle(a));
    console.log("result2: ", result);

    return result;
  }

  async retrieveOne(id: string) {
    const result = await this.dbServer.db
      .collection("articles")
      .findOne({ _id: new ObjectId(id) });
    refactorArticle(result);
    return result;
  }

  async rewriteOne(article: Article) {
    const id = article.id;
    await this.dbServer.db
      .collection("articles")
      .findOneAndReplace({ _id: new ObjectId(id) }, article);
  }
}
