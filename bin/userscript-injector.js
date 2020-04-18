/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const fs = require("fs");

const headerData = JSON.parse(fs.readFileSync("./bin/userscript-header.json")),
    package = JSON.parse(fs.readFileSync("./package.json")),
    browser = process.argv[2] ? process.argv[2] : "chrome";

// Create the userscript header
let header = "// ==UserScript==\n";
for (let [key, value] of Object.entries(headerData)) {
    if (Array.isArray(value)) {
        value.forEach((subValue) => { header += formateHeaderLine(key, subValue);; });
    } else if (typeof value === "object" && value !== null) {
        for (let [subKey, subValue] of Object.entries(value))
            header += formateHeaderLine(key, subKey, subValue);
    } else {
        // assume string
        header += formateHeaderLine(key, value);
    }
}

header = header
    .replace(/(\/\/ @name[ ]+)(.+)/, "$1re621 Injector")
    .replace(/\/\/ @updateURL.*\n/, "")
    .replace(/\/\/ @downloadURL.*\n/, "")
    .replace(/(\/\/ @resource[ ]+re621_css )(.+)/, browser == "chrome" ? "$1file://" + __dirname + "\\..\\build\\style.min.css" : "$1http://localhost:7000/style.min.css")
    .replace(/(\/\/ @resource[ ]+re621_dnp )(.+)/, browser == "chrome" ? "$1file://" + __dirname + "\\..\\build\\avoid-posting.json" : "$1http://localhost:7000/avoid-posting.json");
header += formateHeaderLine("require", browser == "chrome" ? "file://" + __dirname + "\\..\\build\\script.user.js" : "http://localhost:7000/script.user.js");

header += "// ==/UserScript==\n"

// Write to file
fs.writeFileSync("./build/injector.user.js", parseTemplate(header));

/**
 * Replaces the variables in the provided string with those from the package.json
 * @param {*} input String to process
 */
function parseTemplate(input) {
    return input
        .replace(/%NAME%/g, package.name)
        .replace(/%DISPLAYNAME%/g, package.displayName)
        .replace(/%NAMESPACE%/g, package.namespace)
        .replace(/%DESCRIPTION%/g, package.description)
        .replace(/%AUTHOR%/g, package.author)
        .replace(/%VERSION%/g, process.env.GIT_TAG_NAME === undefined ? package.version : process.env.GIT_TAG_NAME)
        .replace(/%BUILD%/g, getBuildTime())
        .replace(/%HOMEPAGE%/g, package.homepage)
        .replace(/%GITHUB%/g, package.github);
}

/**
 * Returns the current time, in YYMMDD:HHMM format
 */
function getBuildTime() {
    function twoDigit(n) { return (n < 10 ? '0' : '') + n; }

    const date = new Date();
    return (date.getFullYear() + "").substring(2) + twoDigit(date.getMonth() + 1) + twoDigit(date.getDate()) + ":" + twoDigit(date.getHours()) + twoDigit(date.getMinutes());
}

function formateHeaderLine(a, b, c) {
    let output = "// @";
    while (a.length < 15) a += " ";
    output += a + " " + b;
    if (c !== undefined) output += " " + c;
    output += "\n";
    return output;
}
