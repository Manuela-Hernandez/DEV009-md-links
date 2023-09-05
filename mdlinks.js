const fs = require('fs');
const path = require('path');
const readFile = require('./data.js');


const mdLinks = (rutaPath) => {
  return new Promise((resolve, reject) => {
    // Ruta absoluta
    const absolutePath = path.resolve(rutaPath);
    // console.log(absolutePath);
    // Identificar si la ruta existe.
    if (!fs.existsSync(absolutePath)) {
      // Si no existe rechazar la promesa.
      reject('La ruta no existe');

    } 
    const extensionArchivo = path.extname(rutaPath);
    // console.log(extensionArchivo);
    if (extensionArchivo !== '.md') {
      reject('El archivo no es de tipo Markdown'); 
    }
    readFile(absolutePath).then((archivoLeido) => {
      resolve(archivoLeido);
    })
    .catch((error) => {
        reject(error)});

  })
}
module.exports = mdLinks;

