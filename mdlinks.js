const fs = require('fs');
const path = require('path');
const { validateLinks, validateMarkdown, processFile } = require('./data.js');


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
          processFile(absolutePathDirectory).then((links) => {
            if(validate) {
              validateLinks(links).then((linksValidados) => {
                resolve(linksValidados);
              })
            }else{
              resolve(links);
            }
          })
        })

      })
      Promise.all(resultDirectory).then((links) => {
        resolve(links.flat());
      })
    } else if (stats.isFile()) {
      // if (validateMarkdown(absolutePath)) {
        processFile(absolutePath).then((links) => {
          if(validate) {
            validateLinks(links).then((linksValidados) => {
              resolve(linksValidados);
            })
          }else{
            resolve(links);
          }
        })
    }
  })
}






module.exports = mdLinks;