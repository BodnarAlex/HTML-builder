const fs = require('fs');
const path = require('path');
const correctPathFrom = path.resolve(__dirname, "styles");
const correctPathTo = path.resolve(__dirname, "project-dist", "bundle.css");
const streamWrite = fs.createWriteStream(correctPathTo, "utf-8");

fs.readdir(correctPathFrom, { withFileTypes: true }, (err, files) => {
    if (err) {
        console.log(err);
    } else {
        files.forEach(file => {
            let extname = path.extname(file.name);
            if (file.isFile() && extname === ".css") {
                let input = fs.createReadStream(path.resolve(correctPathFrom, file.name), "utf-8");
                input.pipe(streamWrite);
            }
        })
    }
})