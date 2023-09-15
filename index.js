const mdLinks = require('./mdlinks.js');

mdLinks('./file.md', true)
    .then((links) => {
        console.log("index: ", links);
    })
    .catch((error) => {
        console.log(error);
    });
