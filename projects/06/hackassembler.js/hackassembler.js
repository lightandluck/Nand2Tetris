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


// var lineNumber = 0; //Counter to keep track of what line number we are on, used so that labels specify correct line
var symbolNumber = 16;  //First location to assign as address for variables
// var strNoLabels = '';   //For first pass to remove labels
var strNoSymbols = '';    //For second pass to replace symbols
var strHack = '';       //For last pass to convert to binary

const rl = readline.createInterface({
    input: fs.createReadStream(readFileName)
});

// const rltest = readline.createInterface({
//     input: fs.createReadStream(readFileName)
// });

// rltest.on('line', (line) => {
//     firstPass.parseLine(line);
// })
// rltest.on('clost', function() {

// })

//First pass to assign values to Labels and remove them.
rl.on('line', (line) => {
    firstPass.parseLine(line);

    //regex to detect full-line comments and blank lines
    // var re = /(^\/\/.*)|(^\s*$)/gm;

    // if(!re.test(line)) { //Not a comment, do stuff

    //     var cleanLine = Parser.removeComment(line).trim();
    //     var commandType = Parser.commandType(cleanLine);

    //     //if the line is not a label, 
    //     if (commandType !== 'L_COMMAND') {
    //         //Instructions are 0-based, incrementing here will put
    //         //the labels at the correct numbered position
    //         lineNumber++; //console.log(lineNumber + ': ' + line);
    //         strNoLabels += cleanLine + '\n';
    //     } else {
    //         var lSymbol = Parser.parseLCommand(cleanLine);
    //         if (!SymbolTable.contains(lSymbol)) {
    //             SymbolTable.addEntry (lSymbol, lineNumber);                
    //         } 
    //     }
    // }
});

rl.on('close', function() {
    //creates stream to pass to next pass through instructions
    // var streamNoLabels = new Readable;
    // streamNoLabels.push(firstPass.toString().trim());
    // streamNoLabels.push(null);

    const rl2 = readline.createInterface({
        input: getReadable(firstPass.toString())
    })

    //Second pass - to replace symbols with numbers
    rl2.on('line', (line) => {        
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
        strNoSymbols += newline + '\n';        
    });


    rl2.on ('close', function() {
        //creates stream to pass to next pass
        var streamNoSymbols = new Readable;
        streamNoSymbols.push(strNoSymbols.trim());
        streamNoSymbols.push(null);

        const rl3 = readline.createInterface({
            input: streamNoSymbols
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
    var stream = new Readable;
    stream.push(str.trim());
    stream.push(null);  

    return stream;

}

var firstPass = runFirstPass();

function runFirstPass() {
    var passLineNumber = 0;
    var passNoLabels = '';
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
                    passLineNumber++; //console.log('pass ' + passLineNumber + ': ' + line);
                    passNoLabels += cleanLine + '\n';
                } else {
                    var lSymbol = Parser.parseLCommand(cleanLine);
                    if (!SymbolTable.contains(lSymbol)) {
                        SymbolTable.addEntry (lSymbol, passLineNumber);                
                    } 
                }
            }
        },

        toString: function() {
            return passNoLabels.trim();
        }
    }
}
