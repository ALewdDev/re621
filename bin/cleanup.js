
/*
    Cleanup
    -------

    Removes temporary build folders.
*/


const { rmdirSync } = require('fs');

const tempFolder = `./build/tsc-temp`;


rmdirSync(tempFolder,{ recursive: true });
