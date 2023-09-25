const mdLinks = require('../mdlinks.js');
const path = require('path');


describe('mdLinks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Deberia de rechazar con un error cuando la ruta no exista', () => {
    mdLinks('/ruta/inexistente.md').catch((error) => {
      expect(error).toBe('La ruta no existe');
    });
  })

  it('Deberia de rechazar con un error cuando no hay archivos dentro del directorio', () => {
    mdLinks('./test/fileMocks3').catch((error) => {
      expect(error).toBe('No se encontraron archivos');
    });
  })

  it('Deberia resolver los links validados cuando la ruta es un directorio', () => {
    return mdLinks('./test/fileMocks', true).then((links) => {
      expect(links).toStrictEqual([
        {
          text: 'axios',
          href: 'https://axios-http.com/',
          file: path.resolve('./test/fileMocks/fileMock1.md'),
          status: 200,
          ok: 'ok'
        },
        {
          text: 'Node',
          href: 'https://nodejs.org/es',
          file: path.resolve('./test/fileMocks/fileMock1.md'),
          status: 200,
          ok: 'ok'
        },
        {
          text: 'Figma',
          href: 'https://www.figma.com/',
          file: path.resolve('./test/fileMocks/fileMocks2/fileMock2.md'),
          status: 200,
          ok: 'ok'
        }
      ]);
    });
  })

  it('Deberia resolver los links sin validar cuando la ruta es un directorio', () => {
    return mdLinks('./test/fileMocks').then((links) => {
      expect(links).toStrictEqual([
        {
          text: 'axios',
          href: 'https://axios-http.com/',
          file: path.resolve('./test/fileMocks/fileMock1.md')
        },
        {
          text: 'Node',
          href: 'https://nodejs.org/es',
          file: path.resolve('./test/fileMocks/fileMock1.md')
        },
        {
          text: 'Figma',
          href: 'https://www.figma.com/',
          file: path.resolve('./test/fileMocks/fileMocks2/fileMock2.md'),
        },
      ]);
    });
  })
 
  it('Deberia resolver los links validados cuando la ruta es un archivo', () => {
    return mdLinks('./test/fileMocks/fileMock1.md', true).then((links) => {
      expect(links).toStrictEqual([
        {
          text: 'axios',
          href: 'https://axios-http.com/',
          file: path.resolve('./test/fileMocks/fileMock1.md'),
          status: 200,
          ok: 'ok'
        },
        {
          text: 'Node',
          href: 'https://nodejs.org/es',
          file: path.resolve('./test/fileMocks/fileMock1.md'),
          status: 200,
          ok: 'ok'
        },
      ]);
    });
  })

  it('Deberia resolver los links sin validar cuando la ruta es un archivo', () => {
    return mdLinks('./test/fileMocks/fileMock1.md').then((links) => {
      expect(links).toStrictEqual([
        {
          text: 'axios',
          href: 'https://axios-http.com/',
          file: path.resolve('./test/fileMocks/fileMock1.md')
        },
        {
          text: 'Node',
          href: 'https://nodejs.org/es',
          file: path.resolve('./test/fileMocks/fileMock1.md')
        }
      ]);
    });
  })

  it('Deberia de rechazar con un error cuando se pasa la ruta de un archivo y no Markdown', () => {
    mdLinks('./test/fileMocks/fileTxt.txt').catch((error) => {
      expect(error).toBe('El archivo no es markdown');
    });
  })
});
