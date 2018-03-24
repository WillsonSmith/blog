#! /usr/local/bin/node
const fs = require('fs');
const crypto = require('crypto');
const cache = require('../src/blog/cache.js');
const marked = require('marked');
const path = require('path');
const entries = process.argv.slice(2);

function checksumFile(algorithm, path) {
  return new Promise((resolve, reject) =>
    fs.createReadStream(path)
      .on('error', reject)
      .pipe(crypto.createHash(algorithm)
        .setEncoding('hex'))
      .once('finish', function () {
        resolve(this.read())
      })
  )
}

function checkCacheEntry(entry, hash) {
  return cache[entry] ? cache[entry] === hash : false;
}

async function buildHash() {
  let entriesBuilder = {};
  const endOfHash = `module.exports = cache;`;
  const currentHashes = await Promise.all(entries.map((entry) => {
    return new Promise(async (resolve, reject) => {
      const entryObject = {};
      try {
        entryObject[entry] = await checksumFile('sha1', `./src/blog/entries/${entry}`);
      } catch(err) {
        console.log(err);
      }
      resolve(entryObject);
    });
  }));
  currentHashes.forEach((hashEntry) => {
    const hash = Object.entries(hashEntry)[0];
    if (!checkCacheEntry(hash[0], hash[1])) {
      buildMarkdown(hash[0]);
    }
    entriesBuilder[hash[0]] = hash[1];
  });

  fs.writeFile('./src/blog/cache.js', `
  const cache = ${JSON.stringify(entriesBuilder)};
  ${endOfHash}
  `, () => {})
  
}

buildHash();


function buildMarkdown(file) {
  const path = `./src/blog/entries/${file}`;
  console.log(path);
  fs.readFile(path, (err, data) => {
    fs.writeFile(`./src/blog/html/${file}.html`, marked(data.toString()), () => console.log('build html'));
  }, () => {});
}

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
