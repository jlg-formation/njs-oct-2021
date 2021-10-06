import express from "express";
import serveIndex from "serve-index";
import { api } from "./api";

console.log("About to start a web server");
const app = express();
const port = +(process.env.GESTION_STOCK_TEST_PORT || "3000");

app.use((req, res, next) => {
  console.log("path", req.url);
  next();
});

app.use("/api", api);

app.use(express.static("."));
app.use(serveIndex(".", { icons: true }));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
