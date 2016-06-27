'use strict';

//grabs file name from arguments
var readfileName = process.argv[2];
var writeFileName = "test_output.txt";

const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: fs.createReadStream(readfileName)
})

var lineNumber = 0;
var strNew = '';

rl.on('line', (line) => {  
    //regex to detect full-line comments and blank lines  
    var re = /(\/\/.*)|(^\s*$)/gm;
    
    if(!re.exec(line)) {
        strNew += line.toString() + '\n';
    }
});

rl.on('close', function() {
    fs.writeFile(writeFileName, strNew.trim(), (err) => {
        if (err) throw err;
    });
});


