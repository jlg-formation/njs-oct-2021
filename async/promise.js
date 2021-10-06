const fs = require("fs");

const readdir = (dirname) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirname, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

const readFile = (filename, options) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, options, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

readdir(".")
  .then((files) => {
    console.log("files: ", files);
    return readFile(files[0], { encoding: "utf-8" });
  })
  .then((content) => {
    console.log("content: ", content);
  })
  .catch((err) => {
    console.log("err: ", err);
  });
