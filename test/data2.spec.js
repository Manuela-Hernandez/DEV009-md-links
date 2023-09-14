const { getFileContent, extractLinks } = require('../data.js');
const path = require('path');
const axios = require('axios');


jest.mock('axios');


describe('getFileContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Deberia leer el documento Markdown', () => {
    getFileContent('./test/fileMocks/fileMock1.md').then((archivoLeido) => {
      expect(archivoLeido).toBe('[axios](https://axios-http.com/)\n\n[Node](https://nodejs.org/es)\n\n');
    });
  })

  it('Deberia generar un error al leer el documento Markdown', () => {
    getFileContent('./test/fileMocks/fileMock1.md').catch((error) => {
      expect(error).toBe('Ha ocurrido un error');
    });
  })
});


describe('extractLinks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Deberia extraer los links', () => {
    const absolutePath = path.resolve('./test/fileMocks/fileMock1.md');
    extractLinks('[axios](https://axios-http.com)\n\n[Node](https://nodejs.org/es)\n\n', absolutePath).then((links) => {
      expect(links).toEqual(([
        {
          text: 'axios',
          href: 'https://axios-http.com',
          file: absolutePath
        },
        {
          text: 'Node',
          href: 'https://nodejs.org/es',
          file: absolutePath
        }, 
      ]));
    });
  })

});