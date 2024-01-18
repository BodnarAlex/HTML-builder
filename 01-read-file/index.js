const path = require("path");
const correctPath = path.resolve(__dirname, "text.txt");

const fs = require("fs");

const stream = fs.createReadStream(correctPath, "utf-8");

let data = "";

stream.on("data", (chunk) => (data += chunk));
stream.on("end", () => console.log( data));
stream.on("error", (error) => console.log("Error", error.message));