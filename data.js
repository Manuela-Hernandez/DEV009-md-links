const fs = require('fs/promises');
const MarkdownIt = require('markdown-it');



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


module.exports = { getFileContent, extractLinks };