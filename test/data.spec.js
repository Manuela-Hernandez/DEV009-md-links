const { getFileContent, extractLinks, validateLinks, validateMarkdown, processFile, stats, readDirectories } = require('../data.js');
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

  it('Deberia deveria devolver el status 404 del link roto', () => {
    const absolutePath = path.resolve('./test/fileMocks/fileMock.md');
    axios.get.mockImplementationOnce(() => new Promise((resolve, reject) => {
      reject({ response: { status: 404 } })
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
          status: 404,
          ok: 'fail'
        }
      ]
      );
    });
  })

  it('Deberia retornar 404 cuando no exista la propiedad status en la respuesta', () => {
    const absolutePath = path.resolve('./test/fileMocks/fileMock.md');
    axios.get.mockImplementationOnce(() => new Promise((resolve, reject) => {
      reject({})
    }));
    const links = [
      {
        text: 'axios',
        href: 'https://axios-http.com/prueba',
        file: absolutePath
      }
    ]
    return validateLinks(links).then((error) => {
      expect(error).toEqual([
        {
          text: 'axios',
          href: 'https://axios-http.com/prueba',
          file: absolutePath,
          status: 404,
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

describe('stats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Deberia retornar el total de links y el total de links unicos', () => {
    const absolutePath = path.resolve('./test/fileMocks/fileMock.md');
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
      {
        text: 'Node',
        href: 'https://nodejs.org/es',
        file: absolutePath
      },
    ]
    expect(stats(links, false)).toStrictEqual({ "Total": 3, "Unique": 2 });
  })

  it('Deberia retornar el total de links, el total de links unicos y el total de links rotos', () => {
    const absolutePath = path.resolve('./test/fileMocks/fileMock.md');
    const links = [
      {
        text: 'axios',
        href: 'https://axios-http.com/prueba',
        file: absolutePath,
        status: 404,
        ok: 'fail'
      },
      {
        text: 'Node',
        href: 'https://nodejs.org/es',
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
      },
    ]
    expect(stats(links, true)).toStrictEqual({ "Total": 3, "Unique": 2, "Broken": 1 });
  })
});

describe('readDirectories', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Deberia retornar un array con los todos archivos del directorio y sub-directorios ', () => {
    expect(readDirectories('./test/fileMocks')).toStrictEqual(
      [
        "test/fileMocks/fileMock1.md",
        "test/fileMocks/fileMocks2/fileMock2.md",
        "test/fileMocks/fileTxt.txt",
        "test/fileMocks/sinLinks.md",
      ]);

  })
});


