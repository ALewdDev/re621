

/*
    Extension-Archive
    ------

    Archives the current extensions build.
*/


const
  archive = require('archiver')('zip'),
  { parseTemplate } = require('./util'),
  { readFileSync , createWriteStream } = require('fs');

const toJSON = (string) =>
  JSON.parse(string);

const throwError = (error) =>
  { throw error; };


//  Files

const [ template , build , package ] = [
  `./build/extension/%NAME%.zip`,
  `./build/extension/src/`,
  `./package.json`
];


//  Build

const
  package = toJSON(readFileSync(package)),
  stream = createWriteStream(parseTemplate(template,package));


//  Write

archive.on('error',throwError);
archive.pipe(stream);
archive.directory(build,false);
archive.finalize();
