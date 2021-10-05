console.log("About to start a web server");

const express = require("express");
const app = express();
const port = 3000;

app.use((req, res, next) => {
  console.log("path", req.url);
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
