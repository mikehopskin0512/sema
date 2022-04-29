const postcss = require('postcss');
const prefixer = require('postcss-prefixer');
const fs = require('fs');

const prefix = 'aui-';
const PATHS = {
  FROM: './dist/styles/bulma-style.css',
  TO_DIST: './dist/styles/styles.css',
}
function deleteSubstring(string, startsWith, endsWith) {
  const startIndex = string.indexOf(startsWith);
  const endIndex = string.indexOf(endsWith);
  return string.substr(0, startIndex) + string.substr(endIndex, string.length);
}
fs.readFile(PATHS.FROM, (err, css) => {
  postcss([
    prefixer({
      prefix: prefix,
    }),
  ])
    .process(css, { from: PATHS.FROM, to: PATHS.TO })
    .then((result) => {
      const _styles = deleteSubstring(result.css, '/* Bulma Base */', '/* Bulma Elements */');
      fs.writeFile(PATHS.TO_DIST, _styles, () => true);
    });
});

