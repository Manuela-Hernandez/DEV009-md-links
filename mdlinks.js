const fs = require('fs');
const path = require('path');
const { getFileContent, extractLinks, validateLink } = require('./data.js');
const { error } = require('console');
// const extraerLinks = require('./data.js');


const mdLinks = (rutaPath, validate) => {
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
          // console.log("extractLinks")
          // console.log("validate: ", validate)

          if (validate) {
            const resultado = links.map(link => {
              return validateLink(link).then((status) => {
                return { ...link, ...status }
              })
            });

            Promise.all(resultado).then((linksValidados) => {
              resolve(linksValidados);
            })
          } else {
            resolve(links);
          }
        })
      })
        .catch((error) => {
          reject(error)
        });
    }

  })
}
module.exports = mdLinks;

