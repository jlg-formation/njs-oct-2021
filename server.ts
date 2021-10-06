console.log("About to start a web server");

import express from "express";
import serveIndex from "serve-index";

const app = express();
const port: number = 3000;
app.use((req, res, next) => {
  console.log("path", req.url);
  next();
});

app.get("/api/now", (req, res) => {
  res.json({
    date: new Date(),
  });
});

let counter = 0;

app.get("/api/counter", (req, res) => {
  res.json({ counter });
  counter++;
});

app.use(express.static("."));
app.use(serveIndex(".", { icons: true }));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
