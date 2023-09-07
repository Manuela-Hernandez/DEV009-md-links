const { error } = require('console');
const { getFileContent, extractLinks } = require('../data.js');
// const fs = require('fs/promises');
const fsPromesas = require('fs/promises');
// const MarkdownIt = require('markdown-it');

jest.mock('fs/promises');
// jest.mock('markdown-it');


describe('getFileContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Deberia leer el documento Markdown', () => {
    fsPromesas.readFile.mockImplementationOnce(() => new Promise((resolve) => {
      resolve('[Archivo](https:/prueba.io/)');
    }));
    getFileContent('/ruta/existente.md').then((archivoLeido) => {
      expect(archivoLeido).toBe('[Archivo](https:/prueba.io/)');
    });
  })

  it('Deberia generar un error al leer el documento Markdown', () => {
    fsPromesas.readFile.mockImplementationOnce(() => new Promise((resolve, reject) => {
      reject('Ha ocurrido un error');
    }));
    getFileContent('/ruta/existente.md').catch((error) => {
      expect(error).toBe('Ha ocurrido un error');
    });
  })
});

describe('extractLinks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Deberia devolver un array con los links  del archivo Markdown', () => {
    fsPromesas.readFile.mockImplementationOnce(() => new Promise((resolve) => {
      resolve('[Archivo](https:/prueba.io/)');
    }));
    extractLinks('[Archivo](https:/prueba.io/)', '/ruta/existente.md').then((links) => {
      expect(links).toEqual(([
        {
          text: 'Archivo',
          href: 'https:/prueba.io/',
          file: '/ruta/existente.md',
        },
        
      ]));
    });
  })

  it('Deberia devolver un array vacio si no encuentra links dentro del archivo', () => {
    fsPromesas.readFile.mockImplementationOnce(() => new Promise((resolve) => {
      resolve('hola');
    }));
    extractLinks('hola', '/ruta/existente.md').then((links) => {
      expect(links).toEqual([]);
    });
  })
  
  // it('Deberia generar un error al devolver el array con los links del archivo Markdown', () => {
    
  //   const parse = jest.fn(() => {throw Error('¡Ocurrio un error!');});
  //   MarkdownIt.mockImplementationOnce(() => {
  //     return {
  //       parse: parse,
  //     };
  //   });
    
  //   extractLinks('[Archivo](https:/prueba.io/)', '/ruta/existente.md').catch((error) => {
  //     expect(error.message).toBe('¡Ocurrio un error!');
  //   });
  // })
});