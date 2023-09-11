const mdLinks = require('../mdlinks.js');
const fs = require('fs');
const fsPromesas = require('fs/promises');
const axios = require('axios');

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('axios');

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
  it('Deberia leer el archivo  Markdown y devolver los links sin validarlos', () => {
    fs.existsSync.mockReturnValueOnce(true)
    fsPromesas.readFile.mockImplementationOnce(() => new Promise((resolve) => {
      resolve('[Hola mundo...](https:/prueba.io/)');
    }));
    mdLinks('/existe.md', false).then((links) => {
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

  it('Deberia leer el archivo  Markdown y devolver los links validados', () => {
    fs.existsSync.mockReturnValueOnce(true)
    fsPromesas.readFile.mockImplementationOnce(() => new Promise((resolve) => {
      resolve('[Hola links validados...](https:/prueba.2/)');
    }));
    axios.get.mockImplementationOnce(() => new Promise ((resolve) => {
      resolve({ status: 200})
    }));
    mdLinks('/existe2.md', true).then((linksValidados) => {
      expect(linksValidados).toEqual([
        {
          text: 'Hola links validados...',
          href: 'https:/prueba.2/',
          file: '/existe2.md',
          status: 200,
          ok: 'ok'

        },
      ]);
    });
  })

  

  it('Deberia leer el archivo  Markdown y devolver los links validados', () => {
    fs.existsSync.mockReturnValueOnce(true)
    fsPromesas.readFile.mockImplementationOnce(() => new Promise((resolve) => {
      resolve('[Hola links validados...](https:/prueba/)');
    }));
    axios.get.mockImplementationOnce(() => new Promise ((resolve, reject) => {
      reject({ status: 'El servidor no responde'})
    }));

    mdLinks('/existe2.md', true).then((linksValidados) => {
      expect(linksValidados).toEqual([
        {
          text: 'Hola links validados...',
          href: 'https:/prueba/',
          file: '/existe2.md',
          status: 'El servidor no responde',
          ok: 'fail'

        },
      ]);
    });
  })

});
