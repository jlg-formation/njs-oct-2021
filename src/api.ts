import express from "express";
import { articleRouter } from "./routers/article.router";

const app = express.Router();

app.get("/now", (req, res) => {
  res.json({
    date: new Date(),
  });
});

let counter = 0;

app.get("/counter", (req, res) => {
  res.json({ counter });
  counter++;
});

app.use("/articles", articleRouter);

export const api = app;
