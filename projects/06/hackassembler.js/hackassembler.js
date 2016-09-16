'use strict';

//TODO: Now how would I have unit tested this file?
const utility = require('./utility.js');
const fs = require('fs');
const Parser = require('./parser.js');
const SymbolTable = require('./symbolTable.js');

var readFileName = process.argv[2];
var writeFileName = utility.getWriteFileName(readFileName);
var firstPass = runFirstPass();
var secondPass = runSecondPass();

var arrInstructions = fs.readFileSync(readFileName, 'utf8').split('\r\n');
var filtered = arrInstructions.filter(isNotComment) //filters out full line comments
    .map(Parser.removeComment)  //remove inline comments from instructions
    .map(firstPass.parseLine)   //assign labels
    .filter(isNotLCommand)      //get rid of labels
    .map(secondPass.parseLine); //assign symbols and convert to binary instructions

fs.writeFile(writeFileName, filtered.join('\n').trim(), (err) => {
    if (err) throw err;
});

function isNotComment(str) {
    var re = /(^\/\/.*)|(^\s*$)/gm;
    return !(re.test(str));
}

function isNotLCommand(str) {
    var commandType = Parser.commandType(str);
    return (commandType !== 'L_COMMAND');
}

function runFirstPass() {
    var lineNumber = 0;
    return {
        parseLine: function(line) {
            var commandType = Parser.commandType(line);

            //if the line is not a label, 
            if (commandType !== 'L_COMMAND') {
                //Instructions are 0-based, incrementing here will put
                //the labels at the correct numbered position
                lineNumber++; 
            } else {
                var lSymbol = Parser.parseLCommand(line);
                if (!SymbolTable.contains(lSymbol)) {
                    SymbolTable.addEntry (lSymbol, lineNumber);                
                }
            }  
            return line;          
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
                    //No new symbol - return binary A-command
                    return Parser.getBinaryACommand(line);
                }
            } else {
                //it's a C-command, return binary
                return Parser.getBinaryCCommand(line);
            }
            //return binary A-command after adding it to symbol table
            return Parser.getBinaryACommand(newline); 
        }
    }
}
