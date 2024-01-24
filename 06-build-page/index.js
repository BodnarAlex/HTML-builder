const fs = require('fs');
const path = require('path');

const correctPathFromAssets = path.resolve(__dirname, "assets");
const correctPathTo = path.resolve(__dirname, "project-dist");
const correctAssets = path.resolve(__dirname, "project-dist", "assets");

const correctPathFromHTML = path.resolve(__dirname, "components");
const correctHTMLFrom = path.resolve(__dirname, "template.html");
const correctHTMLTo = path.resolve(__dirname, "project-dist", "index.html");

fs.rm(correctPathTo, { recursive: true, force: true }, (err) => {
    if (err) throw err
    fs.mkdir(correctPathTo, { recursive: true }, (err) => {
        if (err) throw err;

        copyFilesAndCreateDirectory(correctPathFromAssets, correctAssets);
        mergeStyle();
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

function mergeStyle() {
    const correctPathFromCSS = path.resolve(__dirname, "styles");
    const correctCSS = path.resolve(__dirname, "project-dist", "style.css");
    const streamCSS = fs.createWriteStream(correctCSS);

    fs.readdir(correctPathFromCSS, { withFileTypes: true }, (err, files) => {
        if (err) throw err;
        files.forEach(file => {
            let extname = path.extname(file.name);
            if (file.isFile() && extname === ".css") {
                fs.createReadStream(path.resolve(correctPathFromCSS, file.name)).on('data', dataChunkStyle => {
                    streamCSS.write(dataChunkStyle);
                });
            }
        })
    })
}

function createIndexHtml() {
    const correctPathIndex = path.resolve(__dirname, "project-dist", "index.html");
    const stream = fs.createWriteStream(correctPathIndex, "utf-8");

    const templateHtml = path.resolve(__dirname, "template.html");
    const initHtml = fs.createReadStream(templateHtml, "utf-8");

    let changeHtml = "";
    initHtml.on("data", (chunk) => { changeHtml += chunk });
    initHtml.on("end", () => {
        let forChangeHtml = changeHtml;
        const arrayModules = ['header', 'articles', 'footer'];
        for (const nameTag of arrayModules) {
            let chunkModyleHtml = "";
            let getFullModule = fs.createReadStream(path.resolve(correctPathFromHTML, nameTag + '.html'), 'utf8');
            getFullModule.on("data", (chunk) => { chunkModyleHtml += chunk });
            getFullModule.on("end", () => {
                let tag = '{{' + nameTag + '}}';
                forChangeHtml = forChangeHtml.replace(tag, chunkModyleHtml);
                const correctPath = path.resolve(__dirname, "text.txt");
                const stream2 = fs.createWriteStream(correctPath, "utf-8");
                if(arrayModules.length - 1 === arrayModules.lastIndexOf(nameTag)){
                    stream.write(forChangeHtml + "\n");
                }
            })
        }
    })
}