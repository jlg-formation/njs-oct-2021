const fs = require("fs");

fs.readdir(".", (err, files) => {
  console.log("files: ", files);
});
console.log("hello");
