
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

const destination = `./build/script.js`;

const files = [
  `./bin/common-template.js`,
  `./package.json`,
  destination
];


//  Read Files

const [ template , package , script ] = files.map((path) => readFileSync(path));


//  Build JS

let js = parseTemplate(template.toString(),toJSON(package));

js += '\n\n';

js += script;

js += '\n';


//  Write JS

writeFileSync(destination,js);
