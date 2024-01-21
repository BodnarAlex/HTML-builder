const fs = require('fs');
const path = require('path');
const correctPathFromCSS = path.resolve(__dirname, "styles");
const correctPathFromHTML = path.resolve(__dirname, "components");
const correctPathFromAssets = path.resolve(__dirname, "assets");

const correctPathTo = path.resolve(__dirname, "project-dist");

const correctHTML = path.resolve(__dirname, "project-dist", "index.html");
const correctAssets = path.resolve(__dirname, "project-dist", "assets");


//const streamHTML = fs.createWriteStream(correctHTML, "utf-8");

fs.rm(correctPathTo, { recursive: true, force: true }, (err) => {
    if (err) {
        console.log(err);
    } else {
        fs.mkdir(correctPathTo, { recursive: true }, (err) => {
            if (err) {
                console.log(err);
            } else {
                copyFilesAndCreateDirectory(correctPathFromAssets, correctAssets);
                mergeStyle(correctPathFromCSS);
            }
        });
    }
});

function copyFilesAndCreateDirectory(pathFrom, pathTo) {
    fs.rm(pathTo, { recursive: true, force: true }, (err) => {
        if (err) {
            console.log(err);
        } else {
            fs.mkdir(pathTo, { recursive: true }, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    fs.readdir(pathFrom, { withFileTypes: true }, (err, files) => {
                        if (err) {
                            console.log(err);
                        } else {
                            files.forEach(file => {
                                if (file.isFile()) {
                                    fs.copyFile(path.resolve(pathFrom, file.name), path.resolve(pathTo, file.name), (err) => {
                                        if (err) {
                                            console.log(err);
                                        }
                                    });
                                } else {
                                    copyFilesAndCreateDirectory(path.resolve(pathFrom, file.name), path.resolve(pathTo, file.name));
                                }
                            })
                        }
                    })
                }
            });
        }
    });
}

function mergeStyle(from){
    const correctCSS = path.resolve(__dirname, "project-dist", "style.css");
    const streamCSS = fs.createWriteStream(correctCSS, "utf-8");
    fs.readdir(from, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.log(err);
        } else {
            files.forEach(file => {
                let extname = path.extname(file.name);
                if (file.isFile() && extname === ".css") {
                    let input = fs.createReadStream(path.resolve(from, file.name), "utf-8");
                    input.pipe(streamCSS);
                }
            })
        }
    })
}