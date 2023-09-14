const fs = require('fs');
const path = require('path');
const { validateMarkdown, processFile } = require('./data.js');


const mdLinks = (rutaPath, validate) => {
  return new Promise((resolve, reject) => {
    const absolutePath = path.resolve(rutaPath);
    if (!fs.existsSync(absolutePath)) {
      reject('La ruta no existe');
    }
    const stats = fs.statSync(absolutePath);
    if (stats.isDirectory()) {
      const archivosDirectorio = fs.readdirSync(absolutePath);
      if (archivosDirectorio.length === 0) {
        reject('No se encontraron archivos');
      }
      const filter = archivosDirectorio.filter((file) => {
        const absolutePathDirectory = path.join(absolutePath, file);
        return validateMarkdown(absolutePathDirectory);
      });
      const resultDirectory = filter.map((archivoFiltrado) => {
        return new Promise((resolve) => {
          const absolutePathDirectory = path.join(absolutePath, archivoFiltrado);
          processFile(absolutePathDirectory, validate).then((links) => {
            resolve(links);
          })
        })

      })
      Promise.all(resultDirectory).then((links) => {
        resolve(links.flat());
      })
    } else if (stats.isFile()) {
      // if (validateMarkdown(absolutePath)) {
        processFile(absolutePath, validate).then((links) => {
          resolve(links);
        })
      // } else {
      //   reject('El archivo no es de tipo Markdown');
      // }
    }

  })
}






module.exports = mdLinks;