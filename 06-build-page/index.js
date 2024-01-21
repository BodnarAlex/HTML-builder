const fs = require('fs');
const path = require('path');
const correctPathFromCSS = path.resolve(__dirname, "styles");
const correctPathFromHTML = path.resolve(__dirname, "components");
const correctPathFromAssets = path.resolve(__dirname, "assets");

const correctPathTo = path.resolve(__dirname, "project-dist");

const correctHTMLFrom = path.resolve(__dirname, "template.html");
const correctHTMLTo = path.resolve(__dirname, "project-dist", "index.html");
const correctAssets = path.resolve(__dirname, "project-dist", "assets");

fs.rm(correctPathTo, { recursive: true, force: true }, (err) => {
    if (err) throw err;
    fs.mkdir(correctPathTo, { recursive: true }, (err) => {
        if (err) throw err;

        copyFilesAndCreateDirectory(correctPathFromAssets, correctAssets);
        mergeStyle(correctPathFromCSS);
        createIndexHtml();
    });
});

function copyFilesAndCreateDirectory(pathFrom, pathTo) {
    fs.rm(pathTo, { recursive: true, force: true }, (err) => {
        if (err) throw err;
        fs.mkdir(pathTo, { recursive: true }, (err) => {
            if (err) throw err;
            fs.readdir(pathFrom, { withFileTypes: true }, (err, files) => {
                if (err) throw err;
                files.forEach(file => {
                    if (file.isFile()) {
                        fs.copyFile(path.resolve(pathFrom, file.name), path.resolve(pathTo, file.name), (err) => {
                            if (err) throw err;
                        });
                    } else {
                        copyFilesAndCreateDirectory(path.resolve(pathFrom, file.name), path.resolve(pathTo, file.name));
                    }
                })
            })
        });
    });
}

function mergeStyle(from) {
    const correctCSS = path.resolve(__dirname, "project-dist", "style.css");
    const streamCSS = fs.createWriteStream(correctCSS, "utf-8");

    fs.readdir(from, { withFileTypes: true }, (err, files) => {
        if (err) throw err;
        files.forEach(file => {
            let extname = path.extname(file.name);
            if (file.isFile() && extname === ".css") {
                let input = fs.createReadStream(path.resolve(from, file.name), "utf-8");
                input.pipe(streamCSS);
            }
        })
    })
}

function createIndexHtml() {
    fs.copyFile(correctHTMLFrom, correctHTMLTo, (err) => {
        if (err) throw err;
        fs.readFile(correctHTMLTo, 'utf8', function (error, data) {
            if (error) throw error;
            fs.readdir(correctPathFromHTML, { withFileTypes: true }, function (error, files) {
                if (error) throw error;
                files.forEach(function (file) {
                    fs.readFile(path.resolve(correctPathFromHTML, file.name), 'utf8', function (error, dataFile) {
                        if (error) throw error;
                        let tag = '{{' + path.basename(file.name, '.html') + '}}';
                        data = data.replace(tag, dataFile);
                        fs.writeFile(correctHTMLTo, data, function (error) {
                            if (error) throw error;
                        });
                    });
                });
            });
        });
    });
}
