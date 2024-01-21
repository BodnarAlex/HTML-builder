const fs = require('fs');
const path = require("path");
const correctPath = path.resolve(__dirname, "secret-folder");

fs.readdir(correctPath, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
        let extname = path.extname(file.name);
        let name = path.basename(file.name, extname);
        fs.stat(path.resolve(correctPath, file.name), (error, stats) => {
            if (err) throw err;
            if (file.isFile() && stats.isFile())
                console.log(`${name} - ${extname.slice(1)} - ${stats.size}b`);
        })
    })
})