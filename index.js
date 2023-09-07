const mdLinks = require('./mdlinks.js');

mdLinks('./file.md').then((links) => {
    console.log(links);
})
.catch((error) => {
    console.log(error)});
