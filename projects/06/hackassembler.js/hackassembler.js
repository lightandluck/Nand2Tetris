'use strict';

//TODO: Now how would I have unit tested this file?
//TODO: Is it possible to use promises in Node instead of a chain of callbacks for each pass
const utility = require('./utility.js');
const readline = require('readline');
const fs = require('fs');
const Parser = require('./parser.js');
const SymbolTable = require('./symbolTable.js');
var Readable = require('stream').Readable;

//grabs file name from arguments
var readFileName = process.argv[2];
var writeFileName = utility.getWriteFileName(readFileName);

const rl = readline.createInterface({
    input: fs.createReadStream(readFileName)
});

//First pass to assign values to Labels and remove them.
rl.on('line', (line) => {
    firstPass.parseLine(line);
});

rl.on('close', function() {
    const rl2 = readline.createInterface({
        input: getReadable(firstPass.toString())
    })

    //Second pass - to replace symbols with numbers
    rl2.on('line', (line) => {    
        secondPass.parseLine(line);           
    });


    rl2.on ('close', function() {

        const rl3 = readline.createInterface({
            input: getReadable(secondPass.toString())
        });
        
        //last pass to convert to binary
        rl3.on('line', (line) => {
            thirdPass.parseLine(line);
        });
        
        rl3.on('close', function() {
            fs.writeFile(writeFileName, thirdPass.toString(), (err) => {
                if (err) throw err;
            });
        });        
    });    
});

function getReadable(str) {
    var stream = new Readable;
    stream.push(str.trim());
    stream.push(null);  

    return stream;
}

var firstPass = runFirstPass();
var secondPass = runSecondPass();
var thirdPass = runThirdPass();

function runFirstPass() {
    var lineNumber = 0;
    var str = '';
    return {
        parseLine: function(line) {
            var re = /(^\/\/.*)|(^\s*$)/gm;

            if(!re.test(line)) { //Not a comment, do stuff

                var cleanLine = Parser.removeComment(line).trim();
                var commandType = Parser.commandType(cleanLine);

                //if the line is not a label, 
                if (commandType !== 'L_COMMAND') {
                    //Instructions are 0-based, incrementing here will put
                    //the labels at the correct numbered position
                    lineNumber++; //console.log('pass ' + passLineNumber + ': ' + line);
                    str += cleanLine + '\n';
                } else {
                    var lSymbol = Parser.parseLCommand(cleanLine);
                    if (!SymbolTable.contains(lSymbol)) {
                        SymbolTable.addEntry (lSymbol, lineNumber);                
                    } 
                }
            }
        },

        toString: function() {
            return str.trim();
        }
    }
}

function runSecondPass() {
    var symbolNumber = 16;  //First location to assign as address for variables
    var str = '';    //For second pass to replace symbols
    return {
        parseLine: function(line) {
            var newline = '';

            var commandType = Parser.commandType(line);    
            if (commandType === 'A_COMMAND') {
                var aSymbol = Parser.parseACommand(line);
                //check if A-command is a symbol or number

                if (isNaN(aSymbol)) {
                    //We're looking at a symbol like @R0,
                    //Check if symbol already exists, usually for predefined symbols
                    if (SymbolTable.contains(aSymbol)) {
                        newline = '@' + SymbolTable.getAddress(aSymbol);                
                    } else { //change add to symbol table new variables
                        newline = '@' + symbolNumber;
                        SymbolTable.addEntry (aSymbol, symbolNumber++);
                    }
                } else {
                    newline = line;
                }
            } else {
                newline = line;
            }
            str += newline + '\n';     
        },

        toString: function() {
            return str.trim();
        }
    }
}

function runThirdPass() {
    var str = '';

    return {
        parseLine: function(line) {
            var commandType = Parser.commandType(line);
            var binaryCommand = '';
            if(commandType === 'A_COMMAND') {
                binaryCommand = Parser.getBinaryACommand(line);
            } else if (commandType === 'C_COMMAND') {
                binaryCommand = Parser.getBinaryCCommand(line);
            }
            str += binaryCommand + '\n';
        },

        toString: function() {
            return str.trim();
        }
    }
}
