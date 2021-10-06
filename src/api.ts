import express from "express";

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

export const api = app;
