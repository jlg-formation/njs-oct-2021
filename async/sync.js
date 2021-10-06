const fs = require("fs");

const files = fs.readdirSync(".");
console.log("files: ", files);
