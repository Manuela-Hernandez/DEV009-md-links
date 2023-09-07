const fs = require('fs');
const path = require('path');
const { getFileContent, extractLinks } = require('./data.js');
// const extraerLinks = require('./data.js');


const mdLinks = (rutaPath) => {
  return new Promise((resolve, reject) => {
    const absolutePath = path.resolve(rutaPath);
    // console.log(absolutePath);
    if (!fs.existsSync(absolutePath)) {
      reject('La ruta no existe');
    }
    const archivoMarkdown = ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'];
    const extensionArchivo = path.extname(rutaPath);
    // console.log(extensionArchivo);
    if (!archivoMarkdown.includes(extensionArchivo)) {
      reject('El archivo no es de tipo Markdown');
    } else {
      getFileContent(absolutePath).then((archivoLeido) => {
        // console.log('archivoleido', archivoLeido)
        extractLinks(archivoLeido, absolutePath).then((links) => {
          resolve(links);
        })
          // .catch((error) => {
          //   reject(error)
          // });
      })
        .catch((error) => {
          reject(error)
        });
    }

  })
}
module.exports = mdLinks;

