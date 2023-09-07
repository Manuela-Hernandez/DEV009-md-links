const mdLinks = require('../mdlinks.js');
const fs = require('fs');
const fsPromesas = require('fs/promises');
// const mardownItMock = require ('markdown-it');
// const markdownIt = jest.requireActual('markdown-it');

jest.mock('fs');
jest.mock('fs/promises');
// jest.mock('markdown-it');

describe('mdLinks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
  it('Deberia leer el archivo  Markdown y devolver los links', () => {
    fs.existsSync.mockReturnValueOnce(true)
    fsPromesas.readFile.mockImplementationOnce(() => new Promise((resolve) => {
      resolve('[Hola mundo...](https:/prueba.io/)');
    }));
    mdLinks('/existe.md').then((links) => {
      expect(links).toEqual([
        {
          text: 'Hola mundo...',
          href: 'https:/prueba.io/',
          file: '/existe.md',
        },
      ]);
    });
  })

  it('Deberia mostrar un error al leer el archivo Markdown', () => {
    fs.existsSync.mockReturnValueOnce(true)
    fsPromesas.readFile.mockImplementationOnce(() => new Promise((resolve, reject) => {
      reject('Ha ocurrido un error');
    }));
    mdLinks('/existe.md').catch((error) => {
      expect(error).toBe('Ha ocurrido un error');
    });
  })


  // it('Deberia generar un error al extraer los links', () => {  
  //   fs.existsSync.mockReturnValueOnce(true);
  //   fsPromesas.readFile.mockImplementationOnce(() => new Promise((resolve) => {
  //     resolve('[Hola mundo...](https:/prueba.2/)');
  //   }));
  //   // mardownItMock.mockImplementationOnce(() => false);
  //   mardownItMock.mockImplementation(() => { throw new Error('[¡Ocurrió un error!]'); });
  //   mdLinks('/mockMardown.md').catch((links) => {
  //     expect(links).toBe('[Error: ¡Ocurrió un error!]')
  //   });
  // })

  // it('Deberia mostrar un error al devolver los links', () => {
  //   jest.mock('markdown-it', () => {
  //     return {
  //       parse: mockMarkdownItParse,
  //     };
  //   });
  //   // jest.mock('markdown-it');

  //   fs.existsSync.mockReturnValueOnce(true);
  //   const mockMarkdownItParse = jest.fn(() => false);
  //   // mardownItMock.parse.mockImplementationOnce(() => false);
  //   fsPromesas.readFile.mockImplementationOnce(() => new Promise((resolve) => {
  //     resolve('[Hola mundo...](https:/prueba.2/)');
  //   }));
  //   mdLinks('/existe.md').catch((links) => {
  //     expect(links).toEqual('Ha ocurrido un error');
  //   });
  // })

});
