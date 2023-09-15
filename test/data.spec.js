const { getFileContent, extractLinks, validateLinks, validateMarkdown, processFile } = require('../data.js');
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
    return getFileContent('./test/fileMocks/fileMock.md').catch((error) => {
      expect(error.message).toBe("ENOENT: no such file or directory, open './test/fileMocks/fileMock.md'");
    });
  })
});


describe('extractLinks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Deberia devolver un array con los links del archivo leido', () => {
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

  it('Deberia devolver un array vacio si no encuentra links dentro del archivo', () => {
    extractLinks('./test/sinLinks.md').then((links) => {
      expect(links).toEqual([]);
    });
  })

});

describe('validateLinks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Deberia devolver status 200 de el link', () => {
    const absolutePath = path.resolve('./test/fileMocks/fileMock1.md');
    axios.get.mockResolvedValue({ status: 200 });
    // axios.get.mockImplementationOnce(() => new Promise((resolve) => {
    //   resolve({ status: 200 })
    // }));
    const links = [
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
    ]
    return validateLinks(links).then((status) => {
      expect(status).toEqual([
        {
          text: 'axios',
          href: 'https://axios-http.com',
          file: absolutePath,
          status: 200,
          ok: 'ok'
        },
        {
          text: 'Node',
          href: 'https://nodejs.org/es',
          file: absolutePath,
          status: 200,
          ok: 'ok'
        }
      ]
      );
    });
  })

  it('Deberia devolver el status 400 de el link', () => {
    const absolutePath = path.resolve('./test/fileMocks/fileMock1.md');
    const links = [
      {
        text: 'axios',
        href: 'https://axios-http.com',
        file: absolutePath
      }
    ]
    axios.get.mockImplementationOnce(() => new Promise((resolve) => {
      resolve({ status: 400 })
    }));
    validateLinks(links).then((status) => {
      expect(status).toStrictEqual([
        {
          text: 'axios',
          href: 'https://axios-http.com',
          file: absolutePath,
          status: 400,
          ok: 'fail'
        },
      ]);
    });
  })

  it('Deberia devolver status de el link roto del archivo Markdown', () => {
    const absolutePath = path.resolve('./test/fileMocks/fileMock.md');
    axios.get.mockImplementationOnce(() => new Promise((resolve, reject) => {
      reject({ response: { status: 'Response status: el servidor no responde' } })
    }));
    const links = [
      {
        text: 'axios',
        href: 'https://axios-http.',
        file: absolutePath
      }
    ]
    return validateLinks(links).then((error) => {
      expect(error).toEqual([
        {
          text: 'axios',
          href: 'https://axios-http.',
          file: absolutePath,
          status: 'Response status: el servidor no responde',
          ok: 'fail'
        }
      ]
      );
    });
  })
});




describe('validateMarkdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Deberia retornar true si la ruta es tipo markdown', () => {
    expect(validateMarkdown('./test/fileMocks/fileMock1.md')).toEqual(true);
  });

  it('Deberia retornar false si la ruta es tipo markdown', () => {
    expect(validateMarkdown('./test/fileMocks/fileText.txt')).toEqual(false);
  });

});

describe('processFile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Deberia generar un error al leer el documento Markdown', () => {
    return processFile('./test/fileMocks/fileMock.md').catch((error) => {
      expect(error.message).toBe("ENOENT: no such file or directory, open './test/fileMocks/fileMock.md'");
    });
  })
});