const fs = require('fs/promises');

// Leer el archivo
function readFile(absolutePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(absolutePath, "utf8")
            .then((archivoLeido) => {
                resolve(archivoLeido);
            })
            .catch((error) => {
                reject(error);
            });

    })
    //     fs.readFile(absolutePath, "utf8", (err, archivoLeido) => {
    //         err ? reject(err) : resolve(archivoLeido);
    //       });
    // }) 

}



module.exports = readFile;