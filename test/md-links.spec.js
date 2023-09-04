const mdLinks = require('../mdlinks.js');
const fs = require('fs');

jest.mock('fs')

describe('mdLinks', () => {

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

});
