const fs = require('fs');
const path = require('path');
const correctPathFrom = path.resolve(__dirname, "styles");
const correctPathTo = path.resolve(__dirname, "project-dist", "bundle.css");
const streamWrite = fs.createWriteStream(correctPathTo);

fs.readdir(correctPathFrom, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
        let extname = path.extname(file.name);
        if (file.isFile() && extname === ".css") {
            fs.createReadStream(path.resolve(correctPathFrom, file.name)).on('data', dataChunkStyle => {
                streamWrite.write(dataChunkStyle);
            });
        }
    })
})