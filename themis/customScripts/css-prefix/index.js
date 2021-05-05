const postcss = require('postcss');
const prefixer = require('postcss-prefixer');
const fs = require('fs');

const prefix = 'sema-';
fs.readFile('./bulma.css', (err, css) => {
  postcss([
    prefixer({
      prefix: prefix,
    }),
  ])
    .process(css, { from: './bulma.css', to: './sema-custom.css' })
    .then((result) => {
      fs.writeFile('./sema-custom.css', result.css, () => true);
    });
});
