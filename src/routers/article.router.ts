import express from 'express';
import {ArticleMongoService} from '../services/article-mongo.service';
import {Article} from './../interfaces/Article';
import {WebServer} from './../WebServer';

export const articleRouter = (webServer: WebServer) => {
  // eslint-disable-next-line new-cap
  const app = express.Router();

  app.use(express.json());
  const articleService = new ArticleMongoService(webServer);

  // Create
  app.post('/', (req, res) => {
    (async () => {
      try {
        const article: Partial<Article> = req.body;
        const createdArticle = await articleService.create(article);
        res.status(201).json(createdArticle);
      } catch (err) {
        console.log('err: ', err);
        res.status(500).end();
      }
    })();
  });

  // Retrieve
  app.get('/', (req, res) => {
    (async () => {
      try {
        const articles = await articleService.retrieveAll();
        res.json(articles);
      } catch (err) {
        console.log('err: ', err);
        res.status(500).end();
      }
    })();
  });

  app.get('/:id', (req, res) => {
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
        console.log('err: ', err);
        res.status(500).end();
      }
    })();
  });

  // Update

  // Rewrite
  app.put('/:id', (req, res) => {
    (async () => {
      try {
        const article = req.body as Article;
        const id = req.params.id;
        article.id = id;
        try {
          await articleService.rewriteOne(article);
        } catch (err) {
          if (err.message === 'not found') {
            res.status(404).end();
            return;
          }
          throw err;
        }
        res.status(204).end();
      } catch (err) {
        console.log('err: ', err);
        res.status(500).end();
      }
    })();
  });

  // Patch
  app.patch('/:id', (req, res) => {
    (async () => {
      try {
        const article = req.body as Partial<Article>;
        const id = req.params.id;
        article.id = id;
        try {
          await articleService.patchOne(article);
        } catch (err) {
          if (err.message === 'not found') {
            res.status(404).end();
            return;
          }
          throw err;
        }
        res.status(204).end();
      } catch (err) {
        /* istanbul ignore next */
        {
          console.log('err: ', err);
          res.status(500).end();
        }
      }
    })();
  });

  // Delete
  app.delete('/', (req, res) => {
    (async () => {
      try {
        await articleService.deleteAll();
        res.status(204).end();
      } catch (err) {
        console.log('err: ', err);
        res.status(500).end();
      }
    })();
  });

  app.delete('/:id', (req, res) => {
    (async () => {
      try {
        const id = req.params.id;
        await articleService.deleteOne(id);
        res.status(204).end();
      } catch (err) {
        console.log('err: ', err);
        res.status(500).end();
      }
    })();
  });

  return app;
};
