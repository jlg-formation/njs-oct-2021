import { Article } from "./../interfaces/Article";
import express from "express";

const app = express.Router();

app.use(express.json());

export const articleRouter = app;

let articles: Article[] = [
  {
    id: "a1",
    name: "Tournevis",
    price: 2.99,
    qty: 400,
  },
  {
    id: "a2",
    name: "Pince",
    price: 3.45,
    qty: 23,
  },
  {
    id: "a3",
    name: "Marteau",
    price: 1.5,
    qty: 12,
  },
];

function generateId(articles) {
  return "a" + (Math.max(...articles.map((a) => +a.id.substring(1))) + 1);
}

function generateId2(articles) {
  return Date.now() + "_" + Math.floor(Math.random() * 1e9);
}

// Create
app.post("/", (req, res) => {
  const article: Article = req.body;
  article.id = generateId(articles);
  articles.push(article);
  res.status(201).json(article);
});

// Retrieve
app.get("/", (req, res) => {
  res.json(articles);
});

app.get("/:id", (req, res) => {
  const id = req.params.id;
  const article = articles.find((a) => a.id === id);
  if (!article) {
    res.status(404).end();
    return;
  }
  res.json(article);
});

// Update

// Rewrite
app.put("/:id", (req, res) => {
  const article = req.body as Article;
  const id = req.params.id;
  article.id = id;
  const index = articles.findIndex((a) => a.id === id);
  if (index === -1) {
    res.status(404).end();
    return;
  }
  articles.splice(index, 1, article);
  res.status(204).end();
});

// Patch
app.patch("/:id", (req, res) => {
  const partialArticle = req.body as Partial<Article>;
  const id = req.params.id;
  const article = articles.find((a) => a.id === id);
  if (!article) {
    res.status(404).end();
    return;
  }
  Object.assign(article, partialArticle);
  res.status(204).end();
});

// Delete
app.delete("/", (req, res) => {
  articles = [];
  res.status(204).end();
});

app.delete("/:id", (req, res) => {
  const id = req.params.id;
  articles = articles.filter((a) => a.id !== id);
  res.status(204).end();
});
