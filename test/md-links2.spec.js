const mdLinks  = require('../mdlinks.js');
const path = require('path');


describe('mdLinks', () => {
 
  it('Deberia resolver los links', () => {
    mdLinks('./test/fileMocks/fileMock1.md', true).then((links) => {
      expect(links).toBe([
        {
          text: 'axios',
          href: 'https://axios-http.com',
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

});

