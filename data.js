// const fs = require('fs/promises');
const fs = require('fs');
const MarkdownIt = require('markdown-it');
const axios = require("axios");
const path = require('path');



// Leer el archivo
function getFileContent(absolutePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(absolutePath, 'utf8', (err, archivoLeido) => {
      if (err) {
        reject(err)
      } else {
        resolve(archivoLeido);
      }
    })
  })
}


function extractLinks(archivoLeido, absolutePath) {
  // console.log(archivoLeido);
  return new Promise((resolve, reject) => {
    const markdownIt = new MarkdownIt();
    const result = markdownIt.parse(archivoLeido);
    const links = [];
    for (let i = 1; i <= result.length; i++) {
      const elemento = result[i];
      if (elemento && elemento.type === 'inline' && elemento.content) {
        const linkRegex = /\[(.*?)\]\((.*?)\)/g; // Expresión regular para encontrar enlaces
        const resultContent = linkRegex.exec(elemento.content)
        if (resultContent !== null) {
          // console.log('resultContent', resultContent);
          const text = resultContent[1];
          const url = resultContent[2];
          links.push({ text: text, href: url, file: absolutePath });
        }
      }
    }
    resolve(links);
  })

}

function validateLinks(links) {
  // console.log('links en validate', links);
  return new Promise((resolve) => {
    const resultValidate = links.map(link => {
      // console.log('links.href', link.href);
      return axios.get(link.href)
        .then(function (response) {
          // manejar respuesta exitosa
          return {
            ...link,
            status: response.status,
            // ok: response.status >= 200 && response.status < 400 ? "ok" : "fail",
            ok: 'ok'
          }

        })
        .catch(function (error) {
          // manejar error
          return {
            ...link,
            status: error.response ? error.response.status : 404,
            ok: "fail",
          }

        })
    })
    Promise.all(resultValidate).then((linksValidados) => {
      // console.log('links validados en resolve: ', linksValidados);
      resolve(linksValidados);
    })
  })

}

function validateMarkdown(absolutePath) {
  const archivoMarkdown = ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'];
  const extensionArchivo = path.extname(absolutePath);
  if (archivoMarkdown.includes(extensionArchivo)) {
    return true;
  } else {
    return false;
  }
}

function processFile(absolutePath) {
  return new Promise((resolve, reject) => {
    getFileContent(absolutePath).then((archivoLeido) => {
      // console.log('archivoleido', archivoLeido)
      extractLinks(archivoLeido, absolutePath).then((links) => {
        // console.log("extractLinks")
        // console.log("validate: ", validate)
        resolve(links);
      })
    })
      .catch((error) => {
        reject(error)
      });
  })
}

function stats(links, validate) {
  const newlinks = links.map((link) => link.href);
  const linksUnicos = new Set(newlinks).size;
  // console.log('linksUnicos new Set', linksUnicos);
  const linksStats = {
    'Total': links.length,
    'Unique': linksUnicos,
  };
  if (validate) {
    return {
      ...linksStats,
      'Broken': links.filter((link) => link.ok === 'fail').length
      // console.log('broken: ', broken);
    }
  }
  return linksStats

}



module.exports = { getFileContent, extractLinks, validateLinks, validateMarkdown, processFile, stats };