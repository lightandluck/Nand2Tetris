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

var lineNumber = 0;
var symbolNumber = 16;  //First location to assign as address for variables
var strNoLabels = '';   //For first pass to remove labels
var strNoSymbols = '';    //For second pass to replace symbols
var strHack = '';       //For last pass to convert to binary

const rl = readline.createInterface({
    input: fs.createReadStream(readFileName)
});

//First pass to assign values to Labels and remove them.
rl.on('line', (line) => {
    //regex to detect full-line comments and blank lines
    var re = /(^\/\/.*)|(^\s*$)/gm;

    if(!re.test(line)) {
        var cleanLine = Parser.removeComment(line).trim();
        var commandType = Parser.commandType(cleanLine);

        if (commandType !== 'L_COMMAND') {
            lineNumber++;
            strNoLabels += cleanLine + '\n';
        } else {
            var lSymbol = Parser.parseLCommand(cleanLine);
            if (!SymbolTable.contains(lSymbol)) {
                SymbolTable.addEntry (lSymbol, lineNumber);                
            } 
        }
    }
});

rl.on('close', function() {
    //creates stream to pass to next pass
    var streamNoLabels = new Readable;
    streamNoLabels.push(strNoLabels.trim());
    streamNoLabels.push(null);

    const rl2 = readline.createInterface({
        input: streamNoLabels
    })

    //Second pass - to replace symbols with numbers
    rl2.on('line', (line) => {        
        var newline = '';

        var commandType = Parser.commandType(line);    
        if (commandType === 'A_COMMAND') {
            var aSymbol = Parser.parseACommand(line);
            if (isNaN(aSymbol)) {
                if (SymbolTable.contains(aSymbol)) {
                    newline = '@' + SymbolTable.getAddress(aSymbol);                
                } else {
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


















