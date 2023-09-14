const fs = require('fs/promises');
const MarkdownIt = require('markdown-it');
const axios = require("axios");
const path = require('path');



// Leer el archivo
function getFileContent(absolutePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(absolutePath, "utf8")
            .then((archivoLeido) => {
                resolve(archivoLeido);
            })
            .catch((error) => {
                reject(error);
            });
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

function validateLink(link) {
    // console.log('links en validate', link);
    // console.log('links.href', link.href);
    return axios.get(link.href)
        .then(function (response) {
            // manejar respuesta exitosa
            return {
                status: response.status,
                ok: response.status >= 200 && response.status < 400 ? "ok" : "fail",
            }

        })
        .catch(function (error) {
            // manejar error
            return {
                status: error.response ? error.response.status : "El servidor no responde",
                ok: "fail",
            }

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

function processFile(absolutePath, validate) {
    return new Promise((resolve, reject) => {
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
  
    })
  }


module.exports = { getFileContent, extractLinks, validateLink, validateMarkdown, processFile };