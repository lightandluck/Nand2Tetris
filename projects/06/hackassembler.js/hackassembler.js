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

var firstPass = runFirstPass();
var secondPass = runSecondPass();
//First pass to assign values to Labels and remove them.
rl.on('line', (line) => {
    firstPass.parseLine(line);
});

rl.on('close', function() {
    
    const rl2 = readline.createInterface({
        input: getReadable(firstPass.getString().trim())
    })

    //Second pass - to replace symbols with numbers
    rl2.on('line', (line) => {  
        secondPass.parseLine(line);      
               
    });

    rl2.on ('close', function() {
        
        const rl3 = readline.createInterface({
            input: getReadable(secondPass.getString().trim())
        });
        
        //last pass to convert to binary
        rl3.on('line', (line) => {
            var commandType = Parser.commandType(line);
            var binaryCommand = '';
            if(commandType === 'A_COMMAND') {
                binaryCommand = Parser.getBinaryACommand(line);
            } else if (commandType === 'C_COMMAND') {
                binaryCommand = Parser.getBinaryCCommand(line);
            }
            strHack += binaryCommand + '\n';
        });
        
        rl3.on('close', function() {
            //console.log(strHack);
            fs.writeFile(writeFileName, strHack.trim(), (err) => {
                if (err) throw err;
            });
        });        
    });    
});

function getReadable(str) {
    //creates stream to pass to next pass through instructions
    var stream = new Readable;
    stream.push(str);
    stream.push(null);

    return stream;
}

//TODO: Try to use some form of function composition for these, because they all have the same signature
function runFirstPass() {
    var re = /(^\/\/.*)|(^\s*$)/gm;
    var lineNumber = 0; //Counter to keep track of what line number we are on, used so that labels specify correct line
    var strNoLabels = '';

    return {
        parseLine: function(line) {
            if(!re.test(line)) { //Not a comment, do stuff

                var cleanLine = Parser.removeComment(line).trim();
                var commandType = Parser.commandType(cleanLine);

                //if the line is not a label, 
                if (commandType !== 'L_COMMAND') {
                    //Instructions are 0-based, incrementing here will put
                    //the labels at the correct numbered position
                    lineNumber++;
                    strNoLabels += cleanLine + '\n';
                } else {
                    var lSymbol = Parser.parseLCommand(cleanLine);
                    if (!SymbolTable.contains(lSymbol)) {
                        SymbolTable.addEntry (lSymbol, lineNumber);                
                    } 
                }
            }
        },
        getString: function() {
            return strNoLabels;
        }
    } 
}

function runSecondPass() {
    var newline = '';
    var symbolNumber = 16;  //First location to assign as address for variables
    var strNoSymbols = '';    //For second pass to replace symbols

    return {
        parseLine: function(line) {
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
            strNoSymbols += newline + '\n'; 
        },

        getString: function() {
            return strNoSymbols;
        }
    }
     
}

function runThirdPass() {
    var strHack = '';       //For last pass to convert to binary

    return {

    }
}

