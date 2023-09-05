const mdLinks = require('./mdlinks.js');

mdLinks('./file.md').then(() => {
})
.catch((error) => {
    console.log(error)});
