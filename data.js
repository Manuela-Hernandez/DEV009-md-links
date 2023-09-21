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

// Extraer links
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

// Validar links
function validateLinks(links) {
  return new Promise((resolve) => {
    const resultValidate = links.map(link => {
      return axios.get(link.href)
        .then(function (response) {
          // manejar respuesta exitosa
          return {
            ...link,
            status: response.status,
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
      resolve(linksValidados);
    })
  })

}

// Validar Markdown
function validateMarkdown(absolutePath) {
  const archivoMarkdown = ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'];
  const extensionArchivo = path.extname(absolutePath);
  if (archivoMarkdown.includes(extensionArchivo)) {
    return true;
  } else {
    return false;
  }
}

// Procesar archivo
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

// Estadísticas
function stats(links, validate) {
  const newlinks = links.map((link) => link.href);
  const linksUnicos = new Set(newlinks).size;
  const linksStats = {
    'Total': links.length,
    'Unique': linksUnicos,
  };
  if (validate) {
    return {
      ...linksStats,
      'Broken': links.filter((link) => link.ok === 'fail').length
    }
  }
  return linksStats
}

// Leer directorios
function readDirectories(absolutePath, arrayOfFiles = []) {
  const archivosDirectorio = fs.readdirSync(absolutePath);
  archivosDirectorio.forEach(file => {
    const absolutePathFile = path.join(absolutePath, file)
		const stat = fs.statSync(absolutePathFile)
		if(stat.isDirectory()){
			readDirectories(absolutePathFile, arrayOfFiles)
		}else{
			arrayOfFiles.push(absolutePathFile)
		}
	}
	)
	return arrayOfFiles
}




module.exports = { getFileContent, extractLinks, validateLinks, validateMarkdown, processFile, stats, readDirectories };