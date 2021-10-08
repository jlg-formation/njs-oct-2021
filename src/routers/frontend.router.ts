import { WebServer } from "./../WebServer";
import express from "express";
import { ArticleMongoService } from "../services/article-mongo.service";

export function frontendRouter(webServer: WebServer) {
  const app = express.Router();

  app.get("/", (req, res) => {
    res.render("pages/home");
  });

  app.get("/articles", (req, res) => {
    (async () => {
      try {
        const articleService = new ArticleMongoService(webServer);
        res.render("pages/articles", {
          articles: await articleService.retrieveAll(),
        });
      } catch (err) {
        console.log("err: ", err);
        res.status(500).end();
      }
    })();
  });

  return app;
}
