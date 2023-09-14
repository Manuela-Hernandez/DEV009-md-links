const mdLinks = require('./mdlinks.js');

mdLinks('./README.md', false)
    .then((links) => {
        console.log("index: ", links);
    })
    .catch((error) => {
        console.log(error);
    });
