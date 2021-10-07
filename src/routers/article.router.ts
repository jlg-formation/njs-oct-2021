import { ArticleService } from "./../services/article.service";
import { Article } from "./../interfaces/Article";
import express from "express";

const app = express.Router();

app.use(express.json());

export const articleRouter = app;

const articleService = new ArticleService();

// Create
app.post("/", (req, res) => {
  (async () => {
    try {
      const article: Partial<Article> = req.body;
      await articleService.create(article);
      res.status(201).json(article);
    } catch (err) {
      console.log("err: ", err);
      res.status(500).end();
    }
  })();
});

// Retrieve
app.get("/", (req, res) => {
  (async () => {
    try {
      const articles = await articleService.retrieveAll();
      res.json(articles);
    } catch (err) {
      console.log("err: ", err);
      res.status(500).end();
    }
  })();
});

app.get("/:id", (req, res) => {
  (async () => {
    try {
      const id = req.params.id;
      const article = await articleService.retrieveOne(id);
      if (!article) {
        res.status(404).end();
        return;
      }
      res.json(article);
    } catch (err) {
      console.log("err: ", err);
      res.status(500).end();
    }
  })();
});

// Update

// Rewrite
app.put("/:id", (req, res) => {
  (async () => {
    try {
      const article = req.body as Article;
      const id = req.params.id;
      article.id = id;
      try {
        await articleService.rewriteOne(article);
      } catch (err) {
        if (err.message === "not found") {
          res.status(404).end();
          return;
        }
        throw err;
      }
      res.status(204).end();
    } catch (err) {
      console.log("err: ", err);
      res.status(500).end();
    }
  })();
});

// Patch
app.patch("/:id", (req, res) => {
  (async () => {
    try {
      const article = req.body as Article;
      const id = req.params.id;
      article.id = id;
      try {
        await articleService.patchOne(article);
      } catch (err) {
        if (err.message === "not found") {
          res.status(404).end();
          return;
        }
        throw err;
      }
      res.status(204).end();
    } catch (err) {
      console.log("err: ", err);
      res.status(500).end();
    }
  })();
});

// Delete
app.delete("/", (req, res) => {
  (async () => {
    try {
      await articleService.deleteAll();
      res.status(204).end();
    } catch (err) {
      console.log("err: ", err);
      res.status(500).end();
    }
  })();
});

app.delete("/:id", (req, res) => {
  (async () => {
    try {
      const id = req.params.id;
      await articleService.deleteOne(id);
      res.status(204).end();
    } catch (err) {
      console.log("err: ", err);
      res.status(500).end();
    }
  })();
});
