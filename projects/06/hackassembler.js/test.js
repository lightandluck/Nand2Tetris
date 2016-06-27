'use strict';

//grabs file name from arguments
var fileName = process.argv[2];

const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: fs.createReadStream(fileName)
})

var lineNumber = 0;

rl.on('line', (line) => {  
    //regex to detect full-line comments and blank lines  
    var re = /(\/\/.*)|(^\s*$)/gm;
    
    if(!re.exec(line)) {
        console.log('command:' + lineNumber++, line);
    }
})

//rl.close();
