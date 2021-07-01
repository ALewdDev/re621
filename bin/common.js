
/*
    Common
    ------

    Builds JS from the template, script and package files.
*/


const
  { parseTemplate } = require('./util'),
  { readFileSync , writeFileSync } = require('fs');

const toJSON = (string) =>
  JSON.parse(string);


const files = [
  `./bin/common-template.js`,
  `./build/script.js`,
  `./package.json`
];


//  Read Files

const [ template , script , package ] = files.map((path) => readFileSync(path));


//  Build JS

let js = parseTemplate(template.toString(),toJSON(package));

js += '\n\n';

js += script;

js += '\n';


//  Write JS

writeFileSync(scriptFile,js);
