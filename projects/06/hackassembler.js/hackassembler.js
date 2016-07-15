'use strict';
const utility = require('./utility.js');
const readline = require('readline');
const fs = require('fs');
const Parser = require('./parser.js');

//grabs file name from arguments
var readFileName = process.argv[2];
var writeFileName = utility.getWriteFileName(readFileName);

const rl = readline.createInterface({
    input: fs.createReadStream(readFileName)
})

var lineNumber = 0;
var strNew = '';

rl.on('line', (line) => {  
    //regex to detect full-line comments and blank lines  
    var re = /(\/\/.*)|(^\s*$)/gm;
    
    if(!re.test(line)) {
        var commandType = Parser.commandType(line);
        var binaryCommand = '';
        if(commandType === 'A_COMMAND') {
            binaryCommand = Parser.getBinaryACommand(line.trim());
        } else if (commandType === 'C_COMMAND') {
            binaryCommand = Parser.getBinaryCCommand(line.trim());
        }
        
        strNew += binaryCommand + '\n';
    }
});

rl.on('close', function() {
    fs.writeFile(writeFileName, strNew.trim(), (err) => {
        if (err) throw err;
    });
});



