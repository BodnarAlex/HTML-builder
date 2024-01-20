const path = require("path");
const correctPath = path.resolve(__dirname, "text.txt");

const readline = require('readline');
let rl = readline.createInterface(process.stdin, process.stdout);

const fs = require("fs");
const stream = fs.createWriteStream(correctPath, "utf-8");

const greeting = "Hello. What do you wish to write?..\n";
const farewell = "Quite. It is enough.";


rl.setPrompt(greeting);
rl.prompt();
rl.on('line', (text) => {
    if(text === 'exit'){
        rl.close();
    } else {
        stream.write(text + "\n");
    }
});

rl.on('close', (text) => {
    console.log(farewell);
});