import { Article } from "./../interfaces/Article";
import express from "express";

const app = express.Router();

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

app.delete("/", (req, res) => {
  articles = [];
  res.status(204).end();
});
