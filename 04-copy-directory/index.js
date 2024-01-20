const fs = require('fs');
const path = require('path');
const correctPathFrom = path.resolve(__dirname, "files");
const correctPathTo = path.resolve(__dirname, "files-copy");

fs.rm(correctPathTo, { recursive: true, force: true }, (err) => {
        if (err) {
            console.log(err);
        } else{
            fs.mkdir(correctPathTo, { recursive: true }, (err) => {
                if (err) {
                    console.log(err);
                } else{
                    fs.readdir(correctPathFrom, (err, files) => {
                        if (err) {
                            console.log(err);
                        } else {
                            files.forEach(file => {
                                fs.copyFile(path.resolve(correctPathFrom, file), path.resolve(correctPathTo, file), (err) => {
                                    if (err)
                                        console.log(err);
                                });
                            })
                        }
                    })
                }
            });
        }
    });