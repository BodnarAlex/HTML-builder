const path = require("path");
const correctPath = path.resolve(__dirname, "text.txt");

const readline = require('readline');
let rl = readline.createInterface(process.stdin, process.stdout);

const fs = require("fs");
const stream = fs.createWriteStream(correctPath, "utf-8");
