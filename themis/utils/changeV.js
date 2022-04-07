const fs = require('fs');
const path = require('path');
const fileName = './../src/manifest.json';
const file = require(fileName);

const splittedVersion = file.version.split('.');
splittedVersion[splittedVersion.length - 1]++;
file.version = splittedVersion.join('.');

fs.writeFile(path.join(__dirname, fileName), JSON.stringify(file, null, 2), (error) => {
  if (error) {
    return console.log(error);
  }
  console.log(JSON.stringify(file, null, 2));
});
