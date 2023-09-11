const { getFileContent, extractLinks, validateLink } = require('../data.js');
const fsPromesas = require('fs/promises');
const axios = require('axios');


jest.mock('fs/promises');
jest.mock('axios');


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

  it('Deberia devolver el status de el link del archivo Markdown', () => {
    fsPromesas.readFile.mockImplementationOnce(() => new Promise((resolve) => {
      resolve('[Archivo1](https:/prueba.io/)');
    }));
    axios.get.mockImplementationOnce(() => new Promise ((resolve) => {
      resolve({ status: 200})
    }));
    validateLink(
      {
      text: 'Archivo1',
      href: 'https:/prueba.io/',
      file: '/ruta/existente.md',
    },
  ).then((status) => {
      expect(status).toEqual(
        {
          status: 200,
          ok: 'ok'
        },
      );
    });
  })
  
  it('Deberia devolver el status de el link del archivo Markdown', () => {
    fsPromesas.readFile.mockImplementationOnce(() => new Promise((resolve) => {
      resolve('[Archivo2](https:/prueba.io/)');
    }));
    axios.get.mockImplementationOnce(() => new Promise ((resolve) => {
      resolve({ status: 400})
    }));
    validateLink(
      {
      text: 'Archivo2',
      href: 'https:/prueba.io/',
      file: '/ruta/existente.md',
    },
  ).then((status) => {
      expect(status).toEqual(
        {
          status: 400,
          ok: 'fail'
        },
      );
    });
  })

  it('Deberia devolver el status de el link del archivo Markdown', () => {
    fsPromesas.readFile.mockImplementationOnce(() => new Promise((resolve) => {
      resolve('[Archivo3](https:/prueba.data)');
    }));
    axios.get.mockImplementationOnce(() => new Promise ((resolve, reject) => {
      reject({ status: 'El servidor no responde'})
    }));
    validateLink(
      {
      text: 'Archivo3',
      href: 'https:/prueba.data',
      file: '/ruta/existente.md',
    },
  ).catch((error) => {
      expect(error).toEqual(
        {
          status: 'El servidor no responde',
          ok: 'fail'
        },
      );
    });
  })

  it('Deberia devolver el status de el link del archivo Markdown', () => {
    fsPromesas.readFile.mockImplementationOnce(() => new Promise((resolve) => {
      resolve('[Archivo4](https:/prueba.data.response)');
    }));
    axios.get.mockImplementationOnce(() => new Promise ((resolve, reject) => {
      reject({response: { status: 'Response status: el servidor no responde'}})
    }));
    validateLink(
      {
      text: 'Archivo4',
      href: 'https:/prueba.data.response',
      file: '/ruta/existente.md',
    },
  ).catch((error) => {
      expect(error).toEqual(
        {
          status: 'Response status: el servidor no responde',
          ok: 'fail'
        },
      );
    });
  })
});