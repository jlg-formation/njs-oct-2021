import {WebServer} from './../WebServer';
import express from 'express';
import {ArticleMongoService} from '../services/article-mongo.service';
import {Article} from '../interfaces/Article';

export function frontendRouter(webServer: WebServer) {
  // eslint-disable-next-line new-cap
  const app = express.Router();

  app.get('/', (req, res) => {
    res.render('pages/home');
  });

  app.get('/articles', (req, res) => {
    (async () => {
      try {
        const articleService = new ArticleMongoService(webServer);
        res.render('pages/articles', {
          articles: await articleService.retrieveAll(),
        });
      } catch (err) {
        console.log('err: ', err);
        res.status(500).end();
      }
    })();
  });

  app.get('/articles/add', (req, res) => {
    res.render('pages/add');
  });

  app.use(express.urlencoded({extended: true}));
  app.post('/articles/action/add', (req, res) => {
    (async () => {
      try {
        const articleService = new ArticleMongoService(webServer);
        const article = req.body as Partial<Article>;
        console.log('article: ', article);
        await articleService.create(article);
        res.redirect('/articles');
      } catch (err) {
        console.log('err: ', err);
        res.status(500).end();
      }
    })();
  });

  return app;
}
