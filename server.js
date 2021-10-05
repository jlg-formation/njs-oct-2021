console.log("About to start a web server");

const express = require("express");
const serveIndex = require("serve-index");

const app = express();
const port = 3000;

app.use((req, res, next) => {
  console.log("path", req.url);
  next();
});

app.use(express.static("."));
app.use(serveIndex(".", { icons: true }));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
