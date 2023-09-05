const { rejects } = require('assert');
const mdLinks = require('../mdlinks.js');
const fs = require('fs');
const fsPromesas = require('fs/promises');

jest.mock('fs');
jest.mock('fs/promises');

describe('mdLinks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should...', () => {
    console.log('FIX ME!');
  });
  it('Deberia de rechazar con un error cuando la ruta no exista', () => {
    fs.existsSync.mockReturnValueOnce(false)

    mdLinks('/ruta/inexistente.md').catch((error) => {
      expect(error).toBe('La ruta no existe');
    });
  })
  it('Deberia de rechazar con un error si el archivo no es Markdown', () => {
    fs.existsSync.mockReturnValueOnce(true)
    mdLinks('/ruta/inexistente.js').catch((error) => {
      expect(error).toBe('El archivo no es de tipo Markdown');
    });
  })
  it('Deberia leer el archivo  Markdown', () => {
    fs.existsSync.mockReturnValueOnce(true)
    fsPromesas.readFile.mockImplementationOnce(() => new Promise((resolve) => {
      resolve('Hola mundo...');
    }));
    mdLinks('/existe.md').then((archivoLeido) => {
      expect(archivoLeido).toBe('Hola mundo...');
    });
  })

  it('Deberia mostrar un error al leer el archivo Markdown', () => {
    fs.existsSync.mockReturnValueOnce(true)
    fsPromesas.readFile.mockImplementationOnce(() => new Promise((resolve, reject) => {
      reject('Ha ocurrido un error');
    }));
    mdLinks('/existe.md').catch((archivoLeido) => {
      expect(archivoLeido).toBe('Ha ocurrido un error');
    });
  })

});
