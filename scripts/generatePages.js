#! /usr/local/bin/node
const fs = require('fs');
const entries = process.argv.slice(2);

fs.writeFile("./src/blog/entries.js", 
  (() => {
      const imports = entries.reduce((c, n, i) => {
        return `${c}
          import entry${i} from './entries/${n}';`
      }, '')
      const exports = `export { ${entries.map((entry, index) => 'entry' + index).join(', ')} }`;

      return `${imports}
    ${exports}`;
  })()
, () => console.log('done'));
